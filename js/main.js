// Configuração e inicialização do jogo
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do jogo Phaser com suporte a tela cheia
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.RESIZE,  // Mudar para RESIZE para preencher toda a tela
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'game-container',
            width: 1920,
            height: 1080
        },
        backgroundColor: '#1a1a2e',
        pixelArt: true,  // Importante para pixel art
        roundPixels: true,  // Evita problemas de meio-pixel
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        dom: {
            createContainer: true
        },
        scene: [
            BootScene,
            MainMenuScene,
            WorldScene,
            BuildingScene,
            DialogScene,
            ComputerScene
        ]
    };
    
    // Iniciar o jogo
    const game = new Phaser.Game(config);
    
    // Adicionar evento para alternar tela cheia (opcional)
    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Erro ao tentar entrar em tela cheia:', err);
            });
        }
    };
    
    // Listener para tecla F (fullscreen)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });
    
    // Adicionar botão de tela cheia (opcional - pode remover se não quiser)
    const fullscreenButton = document.createElement('button');
    fullscreenButton.textContent = '📺';
    fullscreenButton.style = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 1000;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 20px;
    `;
    fullscreenButton.onclick = toggleFullscreen;
    document.body.appendChild(fullscreenButton);
    
    // Iniciar carregamento de Pyodide
    console.log("Iniciando carregamento do ambiente Python...");
    pyodideManager.initialize()
        .then(() => {
            console.log("Ambiente Python inicializado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao inicializar ambiente Python:", error);
        });
    
    // Variáveis do jogo (estado global)
    game.gameState = {
        player: {
            name: "Cientista de Dados",
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            money: 1000,
            wellBeing: 100,
            reputation: 50,
            skills: {
                Python: 1.0,
                SQL: 1.0,
                "Machine Learning": 0.5,
                "Visualização de Dados": 1.0,
                "Análise de Dados": 1.0,
                Estatística: 1.0,
                Comunicação: 1.0,
                "Trabalho em Equipe": 1.0
            },
            inventory: [],
            completedTasks: [],
            completedProjects: [],
            currentDay: 1,
            timeOfDay: "Manhã" // Manhã, Tarde, Noite
        },
        
        // Métodos para gerenciar o jogador
        addXP: function(amount) {
            this.player.xp += amount;
            // Verificar se subiu de nível
            if (this.player.xp >= this.player.xpToNextLevel) {
                this.levelUp();
            }
        },
        
        levelUp: function() {
            this.player.level++;
            this.player.xp -= this.player.xpToNextLevel;
            this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.5);
            console.log(`Parabéns! Você avançou para o nível ${this.player.level}!`);
            
            // Aqui poderia mostrar uma mensagem na tela
        },
        
        addMoney: function(amount) {
            this.player.money += amount;
        },
        
        improveSkill: function(skillName, amount) {
            if (this.player.skills[skillName] !== undefined) {
                this.player.skills[skillName] = Math.min(10, this.player.skills[skillName] + amount);
            }
        },
        
        completeTask: function(taskId) {
            // Verificar se já completou antes
            if (!this.player.completedTasks.includes(taskId)) {
                this.player.completedTasks.push(taskId);
                
                // Adicionar recompensas
                const task = TASKS_DATA[taskId];
                if (task) {
                    this.addXP(task.reward_xp);
                    this.addMoney(task.reward_money);
                }
            }
        },
        
        advanceTime: function() {
            // Avançar horário do dia
            switch (this.player.timeOfDay) {
                case "Manhã":
                    this.player.timeOfDay = "Tarde";
                    break;
                case "Tarde":
                    this.player.timeOfDay = "Noite";
                    break;
                case "Noite":
                    this.player.timeOfDay = "Manhã";
                    this.player.currentDay++;
                    break;
            }
            
            console.log(`Agora é ${this.player.timeOfDay} do dia ${this.player.currentDay}`);
        }
    };
});