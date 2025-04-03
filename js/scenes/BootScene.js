class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    
    preload() {
        // Exibir mensagem de carregamento
        const loadingText = this.add.text(400, 300, 'Carregando DataCraft...', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5);
        
        // Carregar placeholders
        this.load.image('placeholder_player', 'assets/placeholders/player.png');
        this.load.image('placeholder_npc', 'assets/placeholders/npc.png');
        this.load.image('placeholder_building', 'assets/placeholders/building.png');
        this.load.image('placeholder_computer', 'assets/placeholders/computer.png');
        
        // Iniciar carregamento do Pyodide
        this.pyodideInitialized = false;
        pyodideManager.initialize().then(() => {
            this.pyodideInitialized = true;
            console.log("Pyodide prontosss!");
        }).catch(error => {
            console.error("Erro ao inicializar Pyodide:", error);
            this.pyodideInitialized = false;
        });
    }
    
    create() {
        this.loadingInterval = setInterval(() => {
            if (this.pyodideInitialized) {
                clearInterval(this.loadingInterval);
                this.scene.start('MainMenuScene');
            }
        }, 500);
        
        // Timeout para caso o Pyodide demore muito
        setTimeout(() => {
            clearInterval(this.loadingInterval);
            if (!this.pyodideInitialized) {
                console.warn("Pyodide demorou demais para carregar. Prosseguindo mesmo assim...");
                this.scene.start('MainMenuScene');
            }
        }, 30000); // 30 segundos de timeout
    }
}