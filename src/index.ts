const readline = require('readline');

// Cria a interface para input/output no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Localizacao {
    nome: string;
    recursos: string[];
    perigos: string[];
    constructor(nome: string, recursos: string[], perigos: string[]) {
        this.nome = nome;
        this.recursos = recursos;
        this.perigos = perigos;
    }

    coletarRecursos() {
        if (this.recursos.length > 0) {
            const recurso = this.recursos[Math.floor(Math.random() * this.recursos.length)];
            console.log(`Você encontrou ${recurso} nesta área.`);
            return recurso;
        } else {
            console.log("Nenhum recurso disponível aqui.");
            return '';
        }
    }
}

class Mapa {
    localizacoes: Localizacao[];
    constructor() {
        this.localizacoes = [
            new Localizacao("Floresta", ["frutas", "lenha", "ervas"], ["animais selvagens"]),
            new Localizacao("Rio", ["água fresca", "peixes"], ["crocodilos"]),
            new Localizacao("Montanha", ["pedras", "minerais"], ["queda de rochas"]),
        ];
    }

    escolherLocalizacao() {
        const index = Math.floor(Math.random() * this.localizacoes.length);
        return this.localizacoes[index];
    }
}

class Game {
    personagem: { nome: string; status: { saude: number; fome: number; sede: number; energia: number; statusEspecial: string; }; };
    mapa: Mapa;
    localizacaoAtual: any;
    turno: number;
    dia: number;
    constructor(personagem: { nome: string; status: { saude: number; fome: number; sede: number; energia: number; statusEspecial: string; }; }, mapa: Mapa) {
        this.personagem = personagem;
        this.mapa = mapa;
        this.localizacaoAtual = this.mapa.escolherLocalizacao();
        this.turno = 1;
        this.dia = 1;
        console.log(`Você está atualmente na localização: ${this.localizacaoAtual.nome}`);
    }

    proximoTurno() {
        this.turno++;
        if (this.turno % 4 === 0) {
            this.dia++;
            console.log(`Dia ${this.dia} começou.`);
            this.atualizarStatus();
        }
        console.log(`Turno ${this.turno}: Escolha uma ação.`);
    }

    atualizarStatus() {
        this.personagem.status.fome -= 10;
        this.personagem.status.sede -= 15;
        this.personagem.status.energia -= 10;

        if (this.personagem.status.fome <= 0 || this.personagem.status.sede <= 0) {
            this.personagem.status.saude -= 10;
            console.log("Sua saúde está diminuindo devido à fome ou sede.");
        }
    }

    explorar() {
        console.log(`Explorando ${this.localizacaoAtual.nome}...`);
        this.localizacaoAtual.coletarRecursos();
        this.personagem.status.energia -= 10;
        this.proximoTurno();
    }

    mudarLocalizacao() {
        this.localizacaoAtual = this.mapa.escolherLocalizacao();
        console.log(`Você se moveu para: ${this.localizacaoAtual.nome}`);
        this.proximoTurno();
    }

    descansar() {
        console.log("Você decidiu descansar.");
        this.personagem.status.energia = Math.min(100, this.personagem.status.energia + 25);
        this.proximoTurno();
    }
}

const personagem = {
    nome: 'Sobrevivente',
    status: {
        saude: 100,
        fome: 80,
        sede: 70,
        energia: 90,
        statusEspecial: 'Normal'
    }
};

const mapa = new Mapa();
const jogo = new Game(personagem, mapa);

console.log("Bem-vindo ao jogo de sobrevivência!");

// Função para capturar e processar as entradas do usuário
function perguntarAcao() {
    rl.question("O que você quer fazer? (explorar, descansar, mover)\n", (resposta: string) => {
        if (resposta === 'explorar') {
            jogo.explorar();
        } else if (resposta === 'descansar') {
            jogo.descansar();
        } else if (resposta === 'mover') {
            jogo.mudarLocalizacao();
        } else {
            console.log("Ação inválida. Tente novamente.");
        }

        // Verifica se o jogo continua ou termina (pode incluir lógica adicional de fim de jogo)
        if (jogo.personagem.status.saude > 0) {
            perguntarAcao();
        } else {
            console.log("Você morreu no jogo.");
            rl.close();
        }
    });
}

// Começa o jogo
perguntarAcao();
