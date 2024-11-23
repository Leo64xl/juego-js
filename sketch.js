var PLAY = 1;
var END = 0;
var gameState = PLAY;
var backsound, deathSound, jumpSound;
var bestScore = 0;
var credito = 0;
var monedasGroup;

function preload() {
    // Cargar imágenes
    trexImage = loadAnimation("iceman4.png", "iceman6.png", "iceman5.png");
    collided = loadAnimation("derretido2.png");
    groundImg = loadImage("fondillo.jpg");
    cloudImg = loadImage("pato2.png");
    obstacle1 = loadImage("fireman.png");
    obstacle2 = loadImage("evil1.png");
    obstacle3 = loadImage("evil2.png");
    obstacle4 = loadImage("fireman.png");
    obstacle5 = loadImage("evil1.png");
    obstacle6 = loadImage("fireman.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    monedaImg = loadImage("moneda.png");

    // Cargar sonidos
    backsound = loadSound("backsound.mp3");
    deathSound = loadSound("death.mp3");
    jumpSound = loadSound("jump.mp3");
    coinSound = loadSound("coin.mp3");  
}

function setup() {
    createCanvas(1350, 670);
    trex = createSprite(60, 155, 20, 50);
    trex.addAnimation("trex", trexImage);
    trex.addAnimation("collided", collided);  
    trex.scale = 0.8;
    
    ground1 = createSprite(13, 280, 600, 34);
    ground1.addImage(groundImg);    
    ground1.depth = -1;
    ground1.scale = 1.2;

    ground2 = createSprite(1095, 280, 600, 34); 
    ground2.addImage(groundImg);
    ground2.depth = -1;
    ground2.scale = 1.2;
    

    invisibleGround = createSprite(300, 465, 2100, 10);
    invisibleGround.visible = false;

    gameOver = createSprite(windowWidth/2, 210);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 1.2;

    restart = createSprite(windowWidth/2, windowHeight/2);
    restart.addImage(restartImg);
    restart.scale = 1.0;

    obstaclesGroup = new Group();
    cloudsGroup = new Group();
    monedasGroup = new Group();

    score = 0;
    
    backsound.loop();
    backsound.setVolume(0.1);  
    backsound.rate(1.0);       
}

function draw() {
    background(160);
    
    if (gameState === PLAY) {
        if (keyDown(LEFT_ARROW)) {
            trex.x -= 10;
        }

        if (keyDown(RIGHT_ARROW)) {
            trex.x += 10;
        }

        if (keyDown(UP_ARROW)) {            
            trex.y -= 90;
            jumpSound.setVolume(4.0);  
            jumpSound.rate(1.5);       
            jumpSound.play();
        }
        
        spawnMonedas();

        if (monedasGroup.isTouching(trex)) {
            credito++;
            coinSound.play(); 
            coinSound.setVolume(2.0);
            monedasGroup[0].destroy();  // Destruye la moneda tocada
        }
        
        score = score + Math.round(getFrameRate() / 60);
        var speedIncrease = 5 + score / 35;
        ground1.velocityX = -speedIncrease;
        ground2.velocityX = -speedIncrease;

        gameOver.visible = false;
        restart.visible = false;

        if (keyDown("space") && trex.y >= invisibleGround.y - 30) {
            trex.velocityY = -15;
            jumpSound.play();  
        }

        trex.velocityY += 1;
       
        if (ground1.x < -ground1.width / 2) {
            ground1.x = ground2.x + ground2.width;
        }
        if (ground2.x < -ground2.width / 2) {
            ground2.x = ground1.x + ground1.width;
        }

        if (obstaclesGroup.isTouching(trex)) {
            deathSound.play();  
            deathSound.setVolume(20.0);  
            deathSound.rate(1.5);       
            gameState = END;
        }

        trex.collide(invisibleGround);
        spawnObstacles(speedIncrease);
        spawnClouds(speedIncrease);

    } else if (gameState === END) {
        ground1.velocityX = 0;
        ground2.velocityX = 0;
        trex.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        
        trex.changeAnimation("collided");  

        gameOver.visible = true;
        restart.visible = true;

        cloudsGroup.setLifetimeEach(-1);
        obstaclesGroup.setLifetimeEach(-1);      

        backsound.stop(); 

        if (score > bestScore) {
            bestScore = score;
        }

        if (mousePressedOver(restart)) {
            reset();
        }
    }

    drawSprites();
    text("Score: " + score, 1250, 50);
    text("Best Score: " + bestScore, 1150, 50);
    text("Moneditas: " + credito, 1050, 50);  // Muestra créditos en pantalla
}

function spawnMonedas() {
    if (frameCount % 100 === 0) {  // Intervalo de aparición
        var moneda = createSprite(900, Math.round(random(380, 430)), 20, 20);
        moneda.addImage(monedaImg);
        moneda.scale = 0.175;
        moneda.velocityX = -2;  // Velocidad de la moneda hacia la izquierda
        monedasGroup.add(moneda);
    }
}

function spawnClouds(speedIncrease) {
    if (frameCount % 70 === 0) {
        var cloud = createSprite(33000, 30, 40, 15);
        cloud.y = Math.round(random(30, 80));
        cloud.addImage(cloudImg);
        cloud.scale = 0.3;
        cloud.velocityX = -speedIncrease * 0.5;

        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        cloudsGroup.add(cloud);
    }
}

function spawnObstacles(speedIncrease) {
    if (frameCount % 60 === 0) {
        var obstacle = createSprite(1000, 415, 1650, 50);//aqui cambia
        obstacle.velocityX = -speedIncrease;

        var ran = Math.round(random(1, 6));
        switch (ran) {
            case 1: obstacle.addImage(obstacle1); 
                break;
            case 2: obstacle.addImage(obstacle2); 
                break;
            case 3: obstacle.addImage(obstacle3); 
                break;
            case 4: obstacle.addImage(obstacle4); 
                break;
            case 5: obstacle.addImage(obstacle5); 
                break;
            case 6: obstacle.addImage(obstacle6); 
                break;
            default: 
                break;
        }
        obstacle.scale = 0.6;
        obstaclesGroup.add(obstacle);
    }
}

function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    monedasGroup.destroyEach();

    trex.changeAnimation("trex");

    score = 0;
    credito = 0;  // Reinicia el contador de créditos
    backsound.loop();
}
