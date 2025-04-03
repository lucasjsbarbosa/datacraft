class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }
    
    create() {
        // Título principal
        this.add.text(400, 100, 'DataCraft', { 
            font: '64px Arial', 
            fill: '#4CAF50' 
        }).setOrigin(0.5);
        
        this.add.text(400, 170, 'A Jornada do Cientista de Dados', { 
            font: '24px Arial', 
            fill: '#ffffff' 
        }).setOrigin(0.5);
        
        // Botão: Nova Jornada
        const newGameButton = this.add.text(400, 300, 'Nova Jornada', { 
            font: '32px Arial', 
            fill: '#ffffff',
            backgroundColor: '#2196F3',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        newGameButton.setInteractive({ useHandCursor: true });
        
        newGameButton.on('pointerover', () => {
            newGameButton.setBackgroundColor('#64B5F6');
        });
        
        newGameButton.on('pointerout', () => {
            newGameButton.setBackgroundColor('#2196F3');
        });
        
        newGameButton.on('pointerdown', () => {
            this.scene.start('WorldScene');
        });

        // Status do Pyodide
        let pyodideStatus = "Carregando Python...";
        let statusColor = '#FFC107'; // Amarelo
        
        if (pyodideManager.initialized) {
            pyodideStatus = "Python carregado com sucesso!";
            statusColor = '#4CAF50'; // Verde
        }
        
        this.add.text(400, 500, pyodideStatus, { 
            font: '18px Arial', 
            fill: statusColor 
        }).setOrigin(0.5);
        
        // Versão e créditos
        this.add.text(400, 550, 'DataCraft v1.0 - Aprenda ciência de dados jogando!', { 
            font: '14px Arial', 
            fill: '#cccccc' 
        }).setOrigin(0.5);
    }
}
