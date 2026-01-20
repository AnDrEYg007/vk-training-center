from PIL import Image, ImageFont
import io

try:
    from pilmoji import Pilmoji
    print("Pilmoji imported successfully")
except ImportError as e:
    print(f"Failed to import Pilmoji: {e}")
    exit(1)

# Create a blank image
image = Image.new('RGB', (500, 200), (255, 255, 255))

try:
    with Pilmoji(image) as pilmoji:
        pilmoji.text((10, 10), "Test Emoji: 😀 😎 🚀", fill=(0, 0, 0))
    print("Pilmoji render executed")
    image.save("test_pilmoji_output.png")
    print("Image saved")
except Exception as e:
    print(f"Pilmoji render failed: {e}")
