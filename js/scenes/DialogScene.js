class DialogScene extends Phaser.Scene {
    constructor() {
        super('DialogScene');
        this.currentNPC = null;
        this.fromScene = null;
    }
    
    init(data) {
        this.currentNPC = data.npcId || null;
        this.fromScene = data.fromScene || 'WorldScene';
    }
    
    create() {
        // Verificar se temos um NPC válido
        if (!this.currentNPC || !NPCS_DATA[this.currentNPC]) {
            console.error("NPC inválido!");
            this.closeDialog();
            return;
        }
        
        const npc = NPCS_DATA[this.currentNPC];
        
        // Criar caixa de diálogo
        this.add.rectangle(400, 450, 780, 250, 0x2c3e50, 0.9).setOrigin(0.5);
        
        // Nome do NPC
        this.add.text(120, 350, npc.name, { 
            font: '24px Arial', 
            fill: '#ffffff' 
        });
        
        // Título/cargo do NPC
        this.add.text(120, 380, npc.title, { 
            font: '16px Arial', 
            fill: '#cccccc' 
        });
        
        // Avatar do NPC (círculo colorido como placeholder)
        this.add.circle(60, 365, 40, npc.color);
        
        // Texto do diálogo inicial
        let dialogueText = npc.dialogues.greeting || "Olá!";
        this.dialogueDisplay = this.add.text(400, 450, dialogueText, { 
            font: '18px Arial', 
            fill: '#ffffff',
            wordWrap: { width: 700 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Opções de diálogo baseadas no tipo de NPC
        this.createDialogOptions(npc);
        
        // Botão de fechar
        const closeButton = this.add.text(700, 350, 'X', { 
            font: '24px Arial', 
            fill: '#ffffff',
            backgroundColor: '#c0392b',
            padding: { x: 10, y: 5 }
        });
        
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => {
            this.closeDialog();
        });
    }
    
    createDialogOptions(npc) {
        const options = [];
        let y = 520;
        
        // Opções com base no tipo de NPC
        switch (npc.type) {
            case 'mentor':
                options.push({ text: "Quero aprender sobre " + npc.specialty, action: "learn" });
                options.push({ text: "Alguma missão para mim?", action: "quest" });
                break;
            
            case 'colleague':
                options.push({ text: "Como vai o trabalho?", action: "chat" });
                options.push({ text: "Alguma dica profissional?", action: "tip" });
                break;
            
            case 'client':
                options.push({ text: "Conte-me sobre seu problema", action: "problem" });
                options.push({ text: "Quero ajudar em seu projeto", action: "accept_task" });
                break;
            
            default:
                options.push({ text: "Sobre o que você trabalha?", action: "chat" });
        }
        
        // Sempre adicionar opção de despedida
        options.push({ text: "Até logo!", action: "farewell" });
        
        // Criar botões para cada opção
        for (const option of options) {
            const optionButton = this.add.text(400, y, option.text, { 
                font: '16px Arial', 
                fill: '#ffffff',
                backgroundColor: '#34495e',
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5);
            
            optionButton.setInteractive({ useHandCursor: true });
            optionButton.on('pointerover', () => {
                optionButton.setBackgroundColor('#2c3e50');
            });
            
            optionButton.on('pointerout', () => {
                optionButton.setBackgroundColor('#34495e');
            });
            
            optionButton.on('pointerdown', () => {
                this.handleDialogOption(option.action);
            });
            
            y += 40;
        }
    }
    
    handleDialogOption(action) {
        const npc = NPCS_DATA[this.currentNPC];
        
        switch (action) {
            case "learn":
                let skills = npc.skills_taught.join(", ");
                this.dialogueDisplay.setText(`Posso te ensinar sobre ${skills}. Qual habilidade você quer desenvolver?`);
                break;
            
            case "quest":
                if (npc.dialogues.quest_offer) {
                    this.dialogueDisplay.setText(npc.dialogues.quest_offer);
                } else {
                    this.dialogueDisplay.setText("Não tenho nenhuma missão para você no momento. Volte mais tarde!");
                }
                break;
            
            case "chat":
                this.dialogueDisplay.setText("O trabalho está ótimo! Estamos trabalhando em alguns projetos interessantes de análise de dados.");
                break;
            
            case "tip":
                if (npc.dialogues.tip) {
                    this.dialogueDisplay.setText(npc.dialogues.tip);
                } else {
                    this.dialogueDisplay.setText("Mantenha-se atualizado com as novas tecnologias. Este campo evolui muito rapidamente!");
                }
                break;
            
            case "problem":
                if (npc.problem) {
                    this.dialogueDisplay.setText(npc.problem);
                } else if (npc.dialogues.task_description) {
                    this.dialogueDisplay.setText(npc.dialogues.task_description);
                } else {
                    this.dialogueDisplay.setText("Tenho um problema complexo que precisa de suas habilidades de ciência de dados.");
                }
                break;
            
            case "accept_task":
                if (npc.task_id && TASKS_DATA[npc.task_id]) {
                    this.dialogueDisplay.setText("Ótimo! Você pode usar um computador para trabalhar neste projeto.");
                } else {
                    this.dialogueDisplay.setText("Obrigado pelo interesse, mas ainda estou definindo os detalhes do projeto.");
                }
                break;
            
            case "farewell":
                this.dialogueDisplay.setText(npc.dialogues.farewell || "Até logo! Foi bom conversar com você.");
                this.time.delayedCall(1500, () => {
                    this.closeDialog();
                });
                break;
        }
    }
    
    closeDialog() {
        // Retornar à cena anterior
        this.scene.resume(this.fromScene);
        this.scene.stop();
    }
}