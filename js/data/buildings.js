// Definições dos edifícios da cidade
const BUILDINGS_DATA = {
    // Empresas
    "tech_startup": {
        id: "tech_startup",
        name: "TechStart Inc.",
        type: "company",
        description: "Uma startup inovadora focada em soluções de IA.",
        position: { x: 200, y: 150 },
        color: 0xE91E63, // Rosa
        width: 80,
        height: 80,
        npcs: ["ana", "mentor_tech"],
        tasks: ["data_analysis_1", "ml_model_basic"],
        interior: {
            background: 0x880E4F, // Rosa escuro
            objects: [
                { type: "computer", x: 300, y: 200, tasks: ["data_analysis_1"] },
                { type: "desk", x: 500, y: 300 }
            ]
        }
    },
    "big_corp": {
        id: "big_corp",
        name: "MegaCorp Analytics",
        type: "company",
        description: "Uma grande corporação com muitos dados e desafios.",
        position: { x: 500, y: 200 },
        color: 0x2196F3, // Azul
        width: 100,
        height: 90,
        npcs: ["pedro", "julia", "sr_rodrigues"],
        tasks: ["sales_forecast", "customer_segmentation"],
        interior: {
            background: 0x0D47A1, // Azul escuro
            objects: [
                { type: "computer", x: 200, y: 250, tasks: ["sales_forecast"] },
                { type: "meeting_room", x: 500, y: 150 }
            ]
        }
    },
    // Academia de Dados
    "data_university": {
        id: "data_university",
        name: "Universidade TechData",
        type: "university",
        description: "A principal instituição de ensino em ciência de dados da cidade.",
        position: { x: 350, y: 400 },
        color: 0x4CAF50, // Verde
        width: 120,
        height: 100,
        npcs: ["prof_silva", "dra_oliveira"],
        tasks: ["python_basics", "sql_intro"],
        interior: {
            background: 0x1B5E20, // Verde escuro
            objects: [
                { type: "computer_lab", x: 300, y: 200, tasks: ["python_basics", "sql_intro"] },
                { type: "library", x: 500, y: 300 }
            ]
        }
    },
    // Café
    "data_cafe": {
        id: "data_cafe",
        name: "Café dos Dados",
        type: "cafe",
        description: "Um local tranquilo para estudar e networking com outros profissionais.",
        position: { x: 650, y: 350 },
        color: 0xFF9800, // Laranja
        width: 70,
        height: 60,
        npcs: ["carlos_viz", "freelancer"],
        tasks: [],
        interior: {
            background: 0xE65100, // Laranja escuro
            objects: [
                { type: "coffee_machine", x: 200, y: 150 },
                { type: "tables", x: 400, y: 300 }
            ]
        }
    },
    // Apartamento do jogador
    "player_apartment": {
        id: "player_apartment",
        name: "Seu Apartamento",
        type: "apartment",
        description: "Seu espaço pessoal para descansar e estudar.",
        position: { x: 100, y: 450 },
        color: 0x9C27B0, // Roxo
        width: 60,
        height: 60,
        npcs: [],
        tasks: ["personal_project"],
        interior: {
            background: 0x4A148C, // Roxo escuro
            objects: [
                { type: "bed", x: 200, y: 200 },
                { type: "computer", x: 500, y: 250, tasks: ["personal_project"] }
            ]
        }
    }
};