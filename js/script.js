window.onload = function() {
    var config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
        backgroundColor: 0xaaaa00,
        scene: [Radar1]
    }

    var game = new Phaser.Game(config);
}



class Radar1 extends Phaser.Scene
{
    create()
    {
        // Radar Settings
        this.radarX = 400;
        this.radarY = 300;
        this.totalCircles = 5;
        this.circleRadius = 30;
        this.totalCircleRadius = this.circleRadius * this.totalCircles;
        this.radarScreenBorderWidth = 10;
        this.triangleLength = this.totalCircleRadius + this.radarScreenBorderWidth;
        this.triangleWidth = 100; // Number from 5 and UP works (Recommended: 100)
        this.radarRotationSpeed = 0.03;
        this.radarSignatureTimer = 2500;



        // Circles Functionality - start
        // radar screen border
        this.radarScreenBorder = this.add.circle(this.radarX, this.radarY, this.totalCircleRadius + (this.radarScreenBorderWidth / 2), 0x000000);
        this.radarScreenBorder.setStrokeStyle(this.radarScreenBorderWidth, 0x008800);
        
        // We'll use this new variable inside the loop and modify its value
        this.totalCircleRadiusCopy = this.totalCircleRadius;

        for(var i = 0; i < this.totalCircles; i++)
        {
            this.circle = this.add.circle(this.radarX, this.radarY, this.totalCircleRadiusCopy, 0x000000);
            this.circle.setStrokeStyle(1, 0x008800);

            this.totalCircleRadiusCopy = this.totalCircleRadiusCopy - this.circleRadius;
        }
        // Circles Functionality - end



        // Lines Functionality - start
        // Verticle Line
        this.verticleLine = this.add.line(0, 0, this.radarX, this.radarY, this.radarX, this.radarY + this.triangleLength * 2 - (this.radarScreenBorderWidth * 2), 0x004400);

        // Horizontal Line
        this.horizontalLine = this.add.line(0, 0, this.radarX, this.radarY, this.radarX + this.triangleLength * 2 - (this.radarScreenBorderWidth * 2), this.radarY, 0x004400);

        // Left Diagonal
        this.leftDiagonal = this.add.line(0, 0, this.radarX, this.radarY, this.radarX + this.triangleLength * 2 - ((this.totalCircles * 1.4) + ((this.circleRadius / 2) / 2) + ((this.circleRadius / 2) * this.totalCircles)) - (this.radarScreenBorderWidth * 2), this.radarY + (((this.circleRadius * 1.5) * this.totalCircles) - ((this.circleRadius / 2) / 2)) - (this.totalCircles * 1.4), 0x004400);

        // Right Diagonal
        this.rightDiagonal = this.add.line(0, 0, this.radarX, this.radarY + (((this.circleRadius * 1.5) * this.totalCircles) - ((this.circleRadius / 2) / 2)) - (this.totalCircles * 1.4), this.radarX + this.triangleLength * 2 - ((this.totalCircles * 1.4) + ((this.circleRadius / 2) / 2) + ((this.circleRadius / 2) * this.totalCircles)) - (this.radarScreenBorderWidth * 2), this.radarY, 0x004400);

        // =====
        
        // Test Left Diagonal - (Uncomment one of the below lines and test the diagonal manually)
        //this.ld1 = this.add.triangle(this.radarX, this.radarY, 150, 150, 150, 0, 0, 0, 0x00fb00);
        //this.ld2 = this.add.triangle(this.radarX, this.radarY, 150, 150, 0, 150, 0, 0, 0x00fb00);

        // Test Right Diagonal - (Uncomment one of the below lines and test the diagonal manually)
        //this.rd1 = this.add.triangle(this.radarX, this.radarY, 0, 0, 150, 0, 0, 150, 0x00fb00);
        //this.rd2 = this.add.triangle(this.radarX, this.radarY, 0, 150, 150, 150, 150, 0, 0x00fb00);
        // Lines Functionality - end

        

        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0x00fb00 }, fillStyle: { color: 0x00fb00 } });
        
        // This triangle acts like a Radar Signal / Rotating Light
        this.triangle = new Phaser.Geom.Triangle(this.radarX, this.radarY, this.radarX + this.triangleLength, this.radarY + this.triangleWidth, this.radarX + this.triangleLength, this.radarY - this.triangleWidth);

        // Display a Dot in Center of Radar Screen
        this.point = this.add.circle(this.radarX, this.radarY, 2, 0x009900);
        


        // Enemies Radar Signature - start
        this.enemies = [
            // Low Radar Signature - e.g. Drone, Semi-Stealth Fighter
            this.add.circle(this.radarX + 50, this.radarY + 115, 1, 0xff0000),
            this.add.circle(this.radarX + 10, this.radarY + 135, 1, 0xff0000),

            // Medium Radar Signature - e.g. Fighter Jet
            this.add.circle(this.radarX + 50, this.radarY + 25, 3, 0xff0000),
            this.add.circle(this.radarX + 10, this.radarY + 45, 3, 0xff0000),
            this.add.circle(this.radarX + -10, this.radarY + -35, 3, 0xff0000),
            this.add.circle(this.radarX + -70, this.radarY + -20, 3, 0xff0000),

            // Hight Radar Signature - e.g. Heavy Bomber
            this.add.circle(this.radarX + -120, this.radarY + 40, 5, 0xff0000)
        ];

        for(var i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].visible = false;
        }
        // Enemies Radar Signature - end



        // Friendly Radar Signature - start
        this.friendlies = [
            // Low Radar Signature - e.g. Drone, Semi-Stealth Fighter
            this.add.circle(this.radarX + 100, this.radarY + -75, 1, 0x00ff00),

            // Medium Radar Signature - e.g. Fighter Jet
            this.add.circle(this.radarX + 10, this.radarY + 5, 3, 0x00ff00),
            this.add.circle(this.radarX + 50, this.radarY + -90, 3, 0x00ff00),
            this.add.circle(this.radarX + 40, this.radarY + -100, 3, 0x00ff00),
            this.add.circle(this.radarX + 40, this.radarY + -90, 3, 0x00ff00)
        ];

        for(var i = 0; i < this.friendlies.length; i++)
        {
            this.friendlies[i].visible = false;
        }
        // Friendly Radar Signature - end
    }

    update()
    {
       this.graphics.clear();
       this.graphics.fillGradientStyle(0x00fb00, 0x00fb00, 0x00fb00, 0x00fb00, 0.5);
       this.graphics.fillTriangleShape(this.triangle);

       Phaser.Geom.Triangle.RotateAroundPoint(this.triangle, this.point, this.radarRotationSpeed);
       


       // Enemies Radar Signature - start
        for(var i = 0; i < this.enemies.length; i++)
        {
            if(Phaser.Geom.Intersects.TriangleToCircle(this.triangle, this.enemies[i]) === true)
            {
                this.enemies[i].visible = true;

                this.time.addEvent({ delay: this.radarSignatureTimer, callback: this.hideRadarSignature, callbackScope: this.enemies[i], loop: false });
            }
        }
       // Enemies Radar Signature - end


       
       // Friendly Radar Signature - start
       for(var i = 0; i < this.friendlies.length; i++)
       {
           if(Phaser.Geom.Intersects.TriangleToCircle(this.triangle, this.friendlies[i]) === true)
           {
               this.friendlies[i].visible = true;

               this.time.addEvent({ delay: this.radarSignatureTimer, callback: this.hideRadarSignature, callbackScope: this.friendlies[i], loop: false });
           }
       }
      // Friendly Radar Signature - end
    }

    hideRadarSignature()
    {
        this.visible = false;
    }
}