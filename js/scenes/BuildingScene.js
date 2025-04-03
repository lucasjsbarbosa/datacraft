class BuildingScene extends Phaser.Scene {
    constructor() {
        super('BuildingScene');
        this.currentBuilding = null;
    }
    
    init(data) {
        this.currentBuilding = data.buildingId || null;
    }
    
    create() {
        // Verificar se temos um edifício válido
        if (!this.currentBuilding || !BUILDINGS_DATA[this.currentBuilding]) {
            console.error("Edifício inválido!");
            this.returnToWorld();
            return;
        }
        
        const building = BUILDINGS_DATA[this.currentBuilding];
        
        // Criar fundo do interior
        this.add.rectangle(0, 0, 800, 600, building.interior.background).setOrigin(0);
        
        // Título do local
        this.add.text(400, 50, building.name, { 
            font: '32px Arial', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
        
        // Descrição
        this.add.text(400, 90, building.description, { 
            font: '16px Arial', 
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        
        // Criar objetos interiores
        this.createInteriorObjects(building);
        
        // Criar NPCs presentes
        this.createBuildingNPCs(building);
        
        // Botão de retornar
        const backButton = this.add.text(50, 550, 'Voltar para a Cidade', { 
            font: '18px Arial', 
            fill: '#ffffff',
            backgroundColor: '#e74c3c',
            padding: { x: 15, y: 10 }
        });
        
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.returnToWorld();
        });
    }
    
    createInteriorObjects(building) {
        // Criar objetos como definidos no interior do edifício
        if (building.interior.objects) {
            for (const object of building.interior.objects) {
                let objectSprite;
                
                // Tipos diferentes de objeto
                switch (object.type) {
                    case 'computer':
                        objectSprite = this.add.rectangle(object.x, object.y, 60, 40, 0x3498db);
                        this.add.text(object.x, object.y, 'PC', { 
                            font: '14px Arial', 
                            fill: '#ffffff' 
                        }).setOrigin(0.5);
                        
                        // Tornar interativo
                        objectSprite.setInteractive({ useHandCursor: true });
                        objectSprite.on('pointerdown', () => {
                            this.useComputer(object.tasks);
                        });
                        break;
                    
                    case 'desk':
                        objectSprite = this.add.rectangle(object.x, object.y, 80, 50, 0x7f8c8d);
                        this.add.text(object.x, object.y, 'Mesa', { 
                            font: '14px Arial', 
                            fill: '#ffffff' 
                        }).setOrigin(0.5);
                        break;
                    
                    case 'bed':
                        objectSprite = this.add.rectangle(object.x, object.y, 100, 60, 0x9b59b6);
                        this.add.text(object.x, object.y, 'Cama', { 
                            font: '14px Arial', 
                            fill: '#ffffff' 
                        }).setOrigin(0.5);
                        
                        objectSprite.setInteractive({ useHandCursor: true });
                        objectSprite.on('pointerdown', () => {
                            this.sleep();
                        });
                        break;
                    
                    default:
                        objectSprite = this.add.rectangle(object.x, object.y, 50, 50, 0xf1c40f);
                        this.add.text(object.x, object.y, object.type, { 
                            font: '12px Arial', 
                            fill: '#ffffff' 
                        }).setOrigin(0.5);
                }
            }
        }
    }
    
    createBuildingNPCs(building) {
        // Encontrar NPCs associados a este edifício
        for (const [key, npc] of Object.entries(NPCS_DATA)) {
            if (npc.building === this.currentBuilding) {
                // Posicionar o NPC aleatoriamente no interior
                const npcX = 200 + Math.random() * 400;
                const npcY = 200 + Math.random() * 200;
                
                // Criar o NPC como um círculo
                const npcSprite = this.add.circle(npcX, npcY, npc.radius, npc.color);
                
                // Adicionar nome
                this.add.text(npcX, npcY - npc.radius - 10, npc.name, { 
                    font: '14px Arial', 
                    fill: '#ffffff' 
                }).setOrigin(0.5);
                
                // Adicionar título/cargo
                this.add.text(npcX, npcY + npc.radius + 10, npc.title, { 
                    font: '12px Arial', 
                    fill: '#cccccc' 
                }).setOrigin(0.5);
                
                // Tornar interativo
                npcSprite.setInteractive({ useHandCursor: true });
                npcSprite.on('pointerdown', () => {
                    this.talkToNPC(key);
                });
            }
        }
    }
    
    useComputer(tasks) {
        console.log('Usando computador', tasks);
        
        // Se não houver tarefas, permitir uso livre
        if (!tasks || tasks.length === 0) {
            this.scene.launch('ComputerScene', { task: null });
            this.scene.pause();
            return;
        }
        
        // Se houver tarefas, mostrar opções
        const taskOptions = [];
        for (const taskId of tasks) {
            if (TASKS_DATA[taskId]) {
                taskOptions.push(taskId);
            }
        }
        
        if (taskOptions.length === 0) {
            this.scene.launch('ComputerScene', { task: null });
            this.scene.pause();
            return;
        }
        
        // Se só tiver uma tarefa, abrir diretamente
        if (taskOptions.length === 1) {
            this.scene.launch('ComputerScene', { task: TASKS_DATA[taskOptions[0]] });
            this.scene.pause();
            return;
        }
        
        // Se tiver múltiplas tarefas, criar menu
        this.showTaskSelectionMenu(taskOptions);
    }
    
    showTaskSelectionMenu(taskIds) {
        // Criar fundo escuro semi-transparente
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        // Título
        this.add.text(400, 150, 'Selecione uma Tarefa', { 
            font: '24px Arial', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
        
        // Listar tarefas
        let y = 200;
        for (const taskId of taskIds) {
            const task = TASKS_DATA[taskId];
            
            const taskButton = this.add.text(400, y, task.title, { 
                font: '18px Arial', 
                fill: '#ffffff',
                backgroundColor: '#2980b9',
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5);
            
            taskButton.setInteractive({ useHandCursor: true });
            taskButton.on('pointerdown', () => {
                // Remover o menu
                overlay.destroy();
                taskButton.destroy();
                
                // Abrir a tarefa
                this.scene.launch('ComputerScene', { task: task });
                this.scene.pause();
            });
            
            y += 50;
        }
        
        // Botão cancelar
        const cancelButton = this.add.text(400, y + 30, 'Cancelar', { 
            font: '18px Arial', 
            fill: '#ffffff',
            backgroundColor: '#e74c3c',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);
        
        cancelButton.setInteractive({ useHandCursor: true });
        cancelButton.on('pointerdown', () => {
            overlay.destroy();
            cancelButton.destroy();
        });
    }
    
    talkToNPC(npcId) {
        console.log(`Conversando com NPC: ${npcId}`);
        
        // Iniciar diálogo
        this.scene.launch('DialogScene', { npcId: npcId, fromScene: 'BuildingScene' });
        this.scene.pause();
    }
    
    sleep() {
        console.log('Dormindo e avançando para o próximo dia');
        // Aqui poderia implementar lógica para avançar o tempo
    }
    
    returnToWorld() {
        this.scene.start('WorldScene');
    }
}