from sqlalchemy import Column, String, Text, ForeignKey
from database import Base

class AiPromptPreset(Base):
    __tablename__ = "ai_prompt_presets"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    name = Column(String)
    prompt = Column(Text)

class GlobalVariableDefinition(Base):
    __tablename__ = "global_variable_definitions"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    placeholder_key = Column(String, nullable=False, unique=True)
    note = Column(Text, nullable=True)

class ProjectGlobalVariableValue(Base):
    __tablename__ = "project_global_variable_values"
    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    definition_id = Column(String, ForeignKey("global_variable_definitions.id", ondelete="CASCADE"), index=True)
    value = Column(Text, nullable=True)