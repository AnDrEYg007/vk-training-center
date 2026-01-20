from PIL import Image, ImageFilter, ImageDraw, ImageOps, ImageFont
import io
import os
import requests
import emoji # Installed via pip install emoji

def create_story_image(
    post_image_bytes: bytes | None,
    group_name: str = None,
    group_photo_bytes: bytes = None,
    post_text: str = None
) -> tuple[bytes | None, dict | None]:
    """
    Creates a 'Repost' style story image mimicking the native VK app style.
    Returns: (image_bytes, metrics_dict)
    """
    try:
        # Target size for Stories (HD 9:16)
        target_width = 1080
        target_height = 1920
        
        # --- 1. Background (Blurred & Zoomed) ---
        # If we have a post image, use it for background.
        # If not, use group avatar.
        # If neither, use a default abstract gradient or dark color.
        
        bg_source = None
        if post_image_bytes:
             try:
                bg_source = Image.open(io.BytesIO(post_image_bytes))
             except: pass
        
        if not bg_source and group_photo_bytes:
             try:
                bg_source = Image.open(io.BytesIO(group_photo_bytes))
             except: pass
             
        if bg_source:
            if bg_source.mode != 'RGB':
                bg_source = bg_source.convert('RGB')
        
            img_ratio = bg_source.width / bg_source.height
            target_ratio = target_width / target_height
            
            bg_transform = bg_source.copy()
            
            if img_ratio > target_ratio:
                new_width = int(bg_transform.height * target_ratio)
                offset = (bg_transform.width - new_width) // 2
                bg_transform = bg_transform.crop((offset, 0, offset + new_width, bg_transform.height))
            else:
                new_height = int(bg_transform.width / target_ratio)
                offset = (bg_transform.height - new_height) // 2
                bg_transform = bg_transform.crop((0, offset, bg_transform.width, offset + new_height))
                
            bg_transform = bg_transform.resize((target_width, target_height), Image.Resampling.LANCZOS)
            bg_transform = bg_transform.filter(ImageFilter.GaussianBlur(radius=40))
        else:
            # Fallback background
            bg_transform = Image.new('RGB', (target_width, target_height), (30, 30, 35))

        # Darken background
        overlay = Image.new('RGBA', bg_transform.size, (0, 0, 0, 120))
        bg_transform.paste(overlay, (0, 0), overlay)

        # --- Constants & Config ---
        # Re-load original for card content if available
        original = None
        if post_image_bytes:
            try:
                original = Image.open(io.BytesIO(post_image_bytes))
                if original.mode != 'RGB':
                    original = original.convert('RGB')
            except:
                original = None

        CARD_WIDTH = 840  # margins side 120
        PADDING = 40
        HEADER_HEIGHT = 80 # Avatar 60px
        
        # Default font (fallback) - on server usually only minimal fonts exist.
        # We try to use a default or load one if available.
        # Attempt to load fonts manually from system paths if on Windows
        import platform
        
        # Determine paths based on environment
        # In Docker (Linux), we will copy fonts to /app/assets/fonts/
        base_dir = os.path.dirname(os.path.abspath(__file__)) # utils/
        project_root = os.path.dirname(base_dir) # backend_python/
        
        # Check local assets folder first (Docker scenario)
        local_font_reg = os.path.join(project_root, "assets", "fonts", "arial.ttf")
        local_font_bold = os.path.join(project_root, "assets", "fonts", "arialbd.ttf")
        local_font_emoji = os.path.join(project_root, "assets", "fonts", "seguiemj.ttf")

        font_path = "arial.ttf"
        font_path_bold = "arialbd.ttf"
        
        if os.path.exists(local_font_reg):
             font_path = local_font_reg
             font_path_bold = local_font_bold
        elif platform.system() == "Windows":
             # Use Segoe UI (Standard) for better Cyrillic support and cleaner look
             # seguiemj.ttf (Emoji) breaks Cyrillic if used as main font.
             font_path = "C:/Windows/Fonts/segoeui.ttf"
             font_path_bold = "C:/Windows/Fonts/segoeuib.ttf"
             
             # Fallback to Arial if Segoe not found
             if not os.path.exists(font_path):
                 font_path = "C:/Windows/Fonts/arial.ttf"
                 font_path_bold = "C:/Windows/Fonts/arialbd.ttf"

        try:
             # Try a standard font if available, else default
             font_bold = ImageFont.truetype(font_path_bold, 36)
             
             try:
                # Prioritize Emoji font
                # Check for local emoji font first
                if os.path.exists(local_font_emoji):
                    font_reg = ImageFont.truetype(font_path, 32)
                    font_emoji = ImageFont.truetype(local_font_emoji, 32)
                elif platform.system() == "Windows":
                    # We load Standard Segoe UI for text
                    font_reg = ImageFont.truetype(font_path, 32)
                    # And Segoe UI Emoji exclusively for emojis
                    try:
                        font_emoji = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 32)
                    except:
                        font_emoji = font_reg
                else:
                    font_reg = ImageFont.truetype(font_path, 32)
                    font_emoji = font_reg
             except:
                font_reg = ImageFont.truetype(font_path, 32)
                font_emoji = font_reg

             button_font = ImageFont.truetype(font_path_bold, 24)
        except:
             # If exact path fails, try just name
             try:
                font_bold = ImageFont.truetype("arialbd.ttf", 36)
                font_reg  = ImageFont.truetype("arial.ttf", 32)
                button_font = ImageFont.truetype("arialbd.ttf", 24)
             except:
                font_bold = ImageFont.load_default()
                font_reg = ImageFont.load_default()
                button_font = ImageFont.load_default()

        # --- 2. Measure Content ---
        # Prepare text with word wrap and newline support
        text_lines = []
        if post_text:
            # Split by newlines first to preserve paragraphs
            paragraphs = post_text.split('\n')
            
            # Allow more lines if no image
            max_lines = 14 if not original else 4
            chars_per_line = 44 
            
            for paragraph in paragraphs:
                if len(text_lines) >= max_lines:
                    break
                    
                # If empty line, add empty spacer if we have room
                if not paragraph.strip():
                    if text_lines and text_lines[-1] != "": 
                        text_lines.append("") 
                    continue
                
                words = paragraph.split()
                current_line = []
                
                for word in words:
                    test_line = ' '.join(current_line + [word])
                    if len(test_line) > chars_per_line:
                        if current_line:
                            text_lines.append(' '.join(current_line))
                        current_line = [word]
                        if len(text_lines) >= max_lines:
                            break
                    else:
                        current_line.append(word)
                
                if current_line and len(text_lines) < max_lines:
                    text_lines.append(' '.join(current_line))
            
            if len(text_lines) >= max_lines:
                 text_lines[-1] += "..."
        
        text_height = 0
        if text_lines:
            for line in text_lines:
                text_height += 20 if line == "" else 45
            text_height += 20 # Bottom margin
            
        # Image height
        # Max dimension inside card
        max_img_h = 900
        img_display_h = 0
        
        if original:
            scale = (CARD_WIDTH - PADDING*2) / original.width
            img_display_h = int(original.height * scale)
            if img_display_h > max_img_h: img_display_h = max_img_h
        
        # Total Card Height
        total_card_h = PADDING + HEADER_HEIGHT + (20 if text_height else 0) + text_height + 20 + img_display_h + PADDING
        
        # Draw Card Base
        card_img = Image.new("RGBA", (CARD_WIDTH, total_card_h), (0,0,0,0))
        draw_card = ImageDraw.Draw(card_img)
        
        # Rounded Rect White
        # We draw on a larger canvas and downscale for AA or just use standard
        draw_card.rounded_rectangle([(0,0), (CARD_WIDTH, total_card_h)], radius=30, fill=(34, 34, 34)) # Dark theme card style like VK dark
        
        cursor_y = PADDING
        
        # --- 3. Header (Avatar + Name) ---
        if group_photo_bytes:
            try:
                avatar = Image.open(io.BytesIO(group_photo_bytes)).convert("RGBA")
                avatar = avatar.resize((HEADER_HEIGHT, HEADER_HEIGHT), Image.Resampling.LANCZOS)
                
                # Circle mask
                mask = Image.new("L", (HEADER_HEIGHT, HEADER_HEIGHT), 0)
                draw_mask = ImageDraw.Draw(mask)
                draw_mask.ellipse((0,0, HEADER_HEIGHT, HEADER_HEIGHT), fill=255)
                
                avatar_comp = ImageOps.fit(avatar, mask.size, centering=(0.5, 0.5))
                avatar_comp.putalpha(mask)
                
                card_img.paste(avatar_comp, (PADDING, cursor_y), avatar_comp)
            except:
                pass
        
        # Name
        text_x = PADDING + HEADER_HEIGHT + 20
        
        # Check for overflow and truncate
        name_text = group_name or "Сообщество"
        available_width = CARD_WIDTH - text_x - PADDING
        
        current_width = 0
        try:
            current_width = font_bold.getlength(name_text)
        except:
            current_width = font_bold.getsize(name_text)[0]
            
        if current_width > available_width:
             # Binary search or simple loop to truncate
             # Loop backwards is safer for correct cutting
             for i in range(len(name_text), 0, -1):
                 candidate = name_text[:i] + "..."
                 try:
                    cand_w = font_bold.getlength(candidate)
                 except:
                    cand_w = font_bold.getsize(candidate)[0]
                 
                 if cand_w <= available_width:
                     name_text = candidate
                     break
        
        # Draw name white
        draw_card.text((text_x, cursor_y + 10), name_text, fill=(255,255,255), font=font_bold)
        
        cursor_y += HEADER_HEIGHT + 20
        
        # --- 4. Post Text ---
        if text_lines:
            
            # Helper to draw mixed text/emoji line
            def draw_mixed_line(draw_obj, xy, line_text, f_text, f_emoji, fill_color):
                cursor_x, cursor_y = xy
                
                # Analyze emojis
                emoji_entries = emoji.emoji_list(line_text)
                
                last_idx = 0
                for entry in emoji_entries:
                    start = entry['match_start']
                    end = entry['match_end']
                    char = entry['emoji']
                    
                    # Draw text segment before emoji
                    if start > last_idx:
                        segment = line_text[last_idx:start]
                        draw_obj.text((cursor_x, cursor_y), segment, font=f_text, fill=fill_color)
                        # Advance cursor
                        try:
                            # Try getlength (Pillow 9.2+)
                            cursor_x += f_text.getlength(segment)
                        except:
                            cursor_x += f_text.getsize(segment)[0]
                    
                    # Draw Emoji
                    # Try to use embedded color if possible (Pillow 10+) for Color Emojis
                    try:
                        draw_obj.text((cursor_x, cursor_y), char, font=f_emoji, fill=fill_color, embedded_color=True)
                    except TypeError:
                         # Fallback for older Pillow
                        draw_obj.text((cursor_x, cursor_y), char, font=f_emoji, fill=fill_color)
                    
                    try:
                        cursor_x += f_emoji.getlength(char)
                    except:
                        cursor_x += f_emoji.getsize(char)[0]
                        
                    last_idx = end
                
                # Draw remaining text
                if last_idx < len(line_text):
                     segment = line_text[last_idx:]
                     draw_obj.text((cursor_x, cursor_y), segment, font=f_text, fill=fill_color)
            
            # Render loop
            for line in text_lines:
                # Use mixed drawer if emojis present, else simple text
                if emoji.emoji_count(line) > 0:
                    try:
                         draw_mixed_line(draw_card, (PADDING, cursor_y), line, font_reg, font_emoji, (255,255,255))
                    except Exception as e:
                         print(f"Mixed render error: {e}")
                         draw_card.text((PADDING, cursor_y), line, fill=(255,255,255), font=font_reg)
                else:
                    draw_card.text((PADDING, cursor_y), line, fill=(255,255,255), font=font_reg)
                
                cursor_y += 45
            
            cursor_y += 20
            
        # --- 5. Post Image ---
        if original:
            try:
                # Resize original for inside card
                # Rounded corners for internal image too usually
                inner_img = original.convert("RGBA")
                
                # Scale to fit width
                inner_w = CARD_WIDTH - PADDING*2
                inner_scale = inner_w / inner_img.width
                inner_h = int(inner_img.height * inner_scale)
                if inner_h > max_img_h:
                     # Crop
                     inner_h = max_img_h
                     inner_img = ImageOps.fit(inner_img, (inner_w, inner_h), centering=(0.5, 0))
                else:
                     inner_img = inner_img.resize((inner_w, inner_h), Image.Resampling.LANCZOS)
                     
                # Round corners of image
                img_mask = Image.new("L", (inner_w, inner_h), 0)
                draw_img_mask = ImageDraw.Draw(img_mask)
                draw_img_mask.rounded_rectangle([(0,0), (inner_w, inner_h)], radius=15, fill=255)
                
                inner_img.putalpha(img_mask)
                
                card_img.paste(inner_img, (PADDING, cursor_y), inner_img)
            except Exception as e:
                print(f"Error processing inner image: {e}")
        
        # --- Final Composite ---
        card_x = (target_width - CARD_WIDTH) // 2
        card_y = (target_height - total_card_h) // 2
        
        bg_transform.paste(card_img, (card_x, card_y), card_img)
        
        # Save
        output = io.BytesIO()
        bg_transform.save(output, format='JPEG', quality=95)
        
        # Calculate metrics for clickable area
        # We need relative coordinates (0.0 to 1.0) for VK API
        # NOTE: VK coordinates are centered.
        metrics = {
            "x": card_x, # Top-left X
            "y": card_y, # Top-left Y
            "width": CARD_WIDTH,
            "height": total_card_h,
            "target_width": target_width,
            "target_height": target_height
        }
        
        return output.getvalue(), metrics
        
        # DEBUG: DRAW RED RECTANGLE TO VERIFY COORDINATES
        draw_debug = ImageDraw.Draw(bg_transform)
        # ... removed for prod
        
    except Exception as e:
        print(f"IMAGE_GEN: Failed to generate story image: {e}")
        return post_image_bytes, None # Fallback
