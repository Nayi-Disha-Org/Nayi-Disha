# Nayi-Disha
graph TD
    %% Root Project
    Root["Nayi-Disha"] --> Backend["backend"]
    Root --> Frontend["frontend"]
    Root --> Readme["README.md"]

    %% Backend Branch
    Backend --> B_Config["config"]
    Backend --> B_Controllers["controllers"]
    Backend --> B_Middlewares["middlewares"]
    Backend --> B_Routes["routes"]
    Backend --> B_Utils["utils"]
    Backend --> B_Server["server.js"]

    %% Frontend Branch
    Frontend --> F_Public["public"]
    Frontend --> F_Src["src"]
    Frontend --> F_Config["postcss.config.js"]
    
    %% Expand Frontend Source
    F_Src --> F_App["App.jsx"]
    F_Src --> F_Assets["assets"]
    F_Src --> F_Components["components"]
    F_Src --> F_Context["context"]

    %% Expand Components
    F_Components --> Charts["charts"]
    F_Components --> Common["common"]
    F_Components --> Layout["layout"]
