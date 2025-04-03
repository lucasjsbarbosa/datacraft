class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
        this.player = null;
        this.buildings = {};
        this.npcs = {};
        this.cursors = null;
        this.gameWidth = 0;
        this.gameHeight = 0;
    }
    
    create() {
        // Obter dimensões da tela
        this.gameWidth = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;
        
        console.log(`Tamanho da tela: ${this.gameWidth}x${this.gameHeight}`);
        
        // Fundo da cidade - ocupando toda a tela
        this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x1E1E1E).setOrigin(0);
        
        // Interface
        this.createUI();
        
        // Criar edifícios
        this.createBuildings();
        
        // Criar NPCs
        this.createNPCs();
        
        // Criar jogador
        this.createPlayer();
        
        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Configurar colisões
        this.configureCollisions();
        
        // Configurar limites do mundo - usamos toda a área visível menos a barra superior
        this.physics.world.setBounds(0, 40, this.gameWidth, this.gameHeight - 40);
    }
    
    createUI() {
        // Barra superior - esticada para toda a largura da tela
        this.add.rectangle(0, 0, this.gameWidth, 40, 0x2C3E50).setOrigin(0);
        
        // Dia e hora - mantido à esquerda
        this.dayText = this.add.text(20, 20, 'Dia 1 - Segunda-feira - Manhã', { 
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            resolution: 2  // Aumenta a resolução para textos mais nítidos
        }).setOrigin(0, 0.5).setScrollFactor(0);
        
        // Dinheiro - alinhado à direita da tela
        this.moneyText = this.add.text(this.gameWidth - 20, 20, 'R$ 1000', { 
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#4CAF50',
            resolution: 2
        }).setOrigin(1, 0.5).setScrollFactor(0);
        
        // XP e nível - centralizado
        this.levelText = this.add.text(this.gameWidth / 2, 20, 'Nível 1 - XP: 0/1000', { 
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFC107',
            resolution: 2
        }).setOrigin(0.5, 0.5).setScrollFactor(0);
        
        // Botão de perfil - próximo à direita
        const profileButton = this.add.text(this.gameWidth - 100, 20, 'Perfil', { 
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#34495E',
            padding: { x: 10, y: 5 },
            resolution: 2
        }).setOrigin(1, 0.5).setScrollFactor(0);
        
        profileButton.setInteractive({ useHandCursor: true });
        profileButton.on('pointerdown', () => {
            console.log('Perfil clicado');
            // Aqui iria para a tela de perfil
        });
    }
    
    createBuildings() {
        // Calcular escala para distribuir os edifícios proporcionalmente
        const scaleX = this.gameWidth / 800;
        const scaleY = this.gameHeight / 600;
        
        // Criar edifícios com base nos dados, ajustados para o tamanho da tela
        for (const [key, building] of Object.entries(BUILDINGS_DATA)) {
            // Calcular posição escalada
            const posX = building.position.x * scaleX;
            const posY = building.position.y * scaleY;
            
            // Ajustar tamanho proporcionalmente
            const width = building.width * Math.min(scaleX, scaleY);
            const height = building.height * Math.min(scaleX, scaleY);
            
            // Criar o edifício como um retângulo colorido
            const buildingSprite = this.add.rectangle(
                posX,
                posY,
                width,
                height,
                building.color
            );
            
            // Adicionar nome do edifício
            const nameText = this.add.text(
                posX,
                posY - height/2 - 15,
                building.name,
                { 
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: '#ffffff',
                    resolution: 2
                }
            ).setOrigin(0.5);
            
            // Tornar o edifício interativo
            buildingSprite.setInteractive({ useHandCursor: true });
            
            // Adicionar evento de clique
            buildingSprite.on('pointerdown', () => {
                this.enterBuilding(key);
            });
            
            // Armazenar referência com posição ajustada
            this.buildings[key] = {
                sprite: buildingSprite,
                nameText: nameText,
                data: {
                    ...building,
                    scaledPosition: { x: posX, y: posY },
                    scaledSize: { width: width, height: height }
                }
            };
        }
    }
    
    createNPCs() {
        // Criar NPCs com base nos dados
        for (const [key, npc] of Object.entries(NPCS_DATA)) {
            // Verificar se o NPC tem um edifício associado
            if (npc.building && this.buildings[npc.building]) {
                const building = this.buildings[npc.building].data;
                
                // Usar a posição escalada do edifício
                let npcX = building.scaledPosition.x + (Math.random() * 60 - 30);
                let npcY = building.scaledPosition.y + (Math.random() * 60 - 30);
                
                // Ajustar o raio do NPC proporcionalmente
                const scaleAvg = (this.gameWidth / 800 + this.gameHeight / 600) / 2;
                const scaledRadius = npc.radius * scaleAvg;
                
                // Criar o NPC como um círculo colorido
                const npcSprite = this.add.circle(
                    npcX,
                    npcY,
                    scaledRadius,
                    npc.color
                );
                
                // Adicionar nome do NPC
                const nameText = this.add.text(
                    npcX,
                    npcY - scaledRadius - 10,
                    npc.name,
                    { 
                        fontFamily: 'Arial',
                        fontSize: '12px',
                        color: '#ffffff',
                        resolution: 2
                    }
                ).setOrigin(0.5);
                
                // Tornar o NPC interativo
                npcSprite.setInteractive({ useHandCursor: true });
                
                // Adicionar evento de clique
                npcSprite.on('pointerdown', () => {
                    this.talkToNPC(key);
                });
                
                // Armazenar referência
                this.npcs[key] = {
                    sprite: npcSprite,
                    nameText: nameText,
                    data: npc,
                    position: { x: npcX, y: npcY }
                };
            }
        }
    }
    
    createPlayer() {
        // Ajustar tamanho do jogador proporcionalmente
        const scaleAvg = (this.gameWidth / 800 + this.gameHeight / 600) / 2;
        const playerSize = 40 * scaleAvg;
        
        // Criar jogador como um retângulo verde, posicionado no centro
        this.player = this.add.rectangle(
            this.gameWidth / 2, 
            this.gameHeight / 2, 
            playerSize, 
            playerSize, 
            0x00FF00
        );
        
        // Física para o jogador
        this.physics.add.existing(this.player);
        
        // Ajustar o corpo do jogador
        this.player.body.setCollideWorldBounds(true);
        
        // Configurar a câmera para seguir o jogador
        this.cameras.main.startFollow(this.player, true);
        
        // Não seguir na UI (barra superior)
        this.cameras.main.setFollowOffset(0, -20);
    }
    
    configureCollisions() {
        // Adicionar física aos edifícios
        for (const buildingKey in this.buildings) {
            const building = this.buildings[buildingKey];
            this.physics.add.existing(building.sprite, true); // true = estático
            
            // Colisão com jogador
            this.physics.add.collider(this.player, building.sprite);
        }
    }
    
    update() {
        // Movimento do jogador
        const scaleAvg = (this.gameWidth / 800 + this.gameHeight / 600) / 2;
        const speed = 200 * scaleAvg; // Velocidade ajustada à escala
        
        // Resetar velocidade
        this.player.body.setVelocity(0);
        
        // Movimento horizontal
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }
        
        // Movimento vertical
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
        }
    }
    
    enterBuilding(buildingId) {
        console.log(`Entrando no edifício: ${buildingId}`);
        
        // Armazenar dados para a cena de edifício
        const buildingData = BUILDINGS_DATA[buildingId];
        
        if (buildingData) {
            // Passar para a cena de edifício
            this.scene.start('BuildingScene', { buildingId: buildingId });
        }
    }
    
    talkToNPC(npcId) {
        console.log(`Conversando com NPC: ${npcId}`);
        
        // Iniciar diálogo
        this.scene.launch('DialogScene', { npcId: npcId });
        this.scene.pause();
    }
}