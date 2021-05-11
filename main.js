import './index.css'
import { sparkline } from "@fnando/sparkline";

class SpeedtestUi {
    constructor(radius, gaugeId = 'gauge', mainBtn = 'btnMain', elDown = 'numDown', elUp = 'numUp', elPing = 'ping', elJitter = 'jitter', sparkDown = 'sparkDown', sparkUp = 'sparkUp', mbps = 0) {
        this.elId = gaugeId;

        this.elGauge = document.getElementById(gaugeId);
        this.elBtn = document.getElementById(mainBtn);
        this.elDown = document.getElementById(elDown);
        this.elUp = document.getElementById(elUp);
        this.elPing = document.getElementById(elPing);
        this.elJiiter = document.getElementById(elJitter);
        this.sparkDown = document.getElementById(sparkDown);
        this.sparkUp = document.getElementById(sparkUp);
        
        this.radius = radius;
        this.strokeWidth = radius * 0.15;
        this.innerRadius = radius - ( this.strokeWidth / 2 );
        this.circumference = this.innerRadius * 2 * Math.PI;
        this.arc = this.circumference * (270 / 360);
        this.dashArray = `${this.arc} ${this.circumference}`;
        this.transform = `rotate(135, ${radius}, ${radius})`;

        this.download = 0;
        this.upload = 0;
        this.ping = 0;
        this.jitter = 0;
        this.sparkDownData = [];
        this.sparkUpData = [];
        this.btnText = 'Start';

        this.genSvg();
        this.mbitPerSec = mbps;
    }
  
    genSvg() {
        const svgScales = this.genScales();
        const svgGradient = '<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#0EA5E9;stop-opacity:1" /><stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" /></linearGradient></defs>';
        const svgStart = '<svg viewBox="0 0 '+(this.radius * 2)+' '+(this.radius * 2)+'">';
        const svgBase = '<circle class="gauge_base" cx="'+this.radius+'" cy="'+this.radius+'" fill="transparent" stroke-linecap="" r="'+this.innerRadius+'" stroke-width="'+this.strokeWidth+'"stroke-dasharray="'+this.dashArray+'" transform="'+this.transform+'" stroke="#262626"/>';
        const svgPerc = '<circle id="gauge_percent" style="transition: stroke-dashoffset 0.3s" cx="'+this.radius+'" cy="'+this.radius+'" fill="transparent" stroke-linecap="" r="'+this.innerRadius+'" stroke-width="'+this.strokeWidth+'"stroke-dasharray="'+this.dashArray+'" transform="'+this.transform+'" stroke-dashoffset="'+this.offset+'" stroke="url(#grad)"/>';
        const svgEnd = '</svg>';
        this.elGauge.innerHTML = svgStart+svgGradient+svgBase+svgPerc+svgScales+svgEnd;
        this.elPerc = document.getElementById(this.elId+'_percent');
        document.elPerc = this.elPerc;
    }

    genScales() {
        const scales = [0,5,10,25,50,100,250,500,1000,'2000+'];
        let svgScales = '';
        let sa = -225;
        let rad = Math.PI / 180;
        let sr1 = this.radius;
        let sr2 = this.radius - 40;
        let srT = this.radius - 60;
        scales.forEach(num => {
            var sxT = this.radius + srT * Math.cos(sa * rad);
            var syT = this.radius + srT * Math.sin(sa * rad);
            var sx1 = this.radius + sr1 * Math.cos(sa * rad);
            var sy1 = this.radius + sr1 * Math.sin(sa * rad);
            var sx2 = this.radius + sr2 * Math.cos(sa * rad);
            var sy2 = this.radius + sr2 * Math.sin(sa * rad);
    
            svgScales += '<text class="scale" font-weight="200" stroke="#F5F5F5" text-anchor="middle" alignment-baseline="central" x="'+sxT+'" y="'+syT+'">'+num+'</text>'; 
            svgScales += '<line class="scale" style="stroke-width:2" stroke="white" opacity="0.5" x1="'+sx1+'" y1="'+sy1+'" x2="'+sx2+'" y2="'+sy2+'"></line>'; 
            sa += 30;
        });
        return svgScales;
    }

    set mbitPerSec(mbps) {
        let offset = 0;
        if(mbps <= 10) {
            offset = (mbps - 0) * (60 - 0) / (10 - 0) + 0;
        } else if(mbps <= 25) {
            offset = (mbps - 10) * (90 - 60) / (25 - 10) + 60;
        } else if(mbps <= 50) {
            offset = (mbps - 25) * (120 - 90) / (50 - 25) + 90;
        } else if(mbps <= 100) {
            offset = (mbps - 50) * (150 - 120) / (100 - 50) + 120;
        } else if(mbps <= 250) {
            offset = (mbps - 100) * (180 - 150) / (250 - 100) + 150;
        } else if(mbps <= 500) {
            offset = (mbps - 250) * (210 - 180) / (500 - 250) + 180;
        } else if(mbps <= 1000) {
            offset = (mbps - 500) * (240 - 210) / (1000 - 500) + 210;
        } else if(mbps <= 2000) {
            offset = (mbps - 1000) * (270 - 240) / (2000 - 1000) + 240;
        } else if(mbps > 2000) {
            offset = 270;
        }
        this.elPerc.setAttribute('stroke-dashoffset', this.arc - (this.arc / 270) * offset);
    }

    set btnText(txt) {
        this.elBtn.innerText = txt;
    }

    set download(val) {
        this.elDown.innerText = Math.round((val) * 100) / 100;
    }
    set upload(val) {
        this.elUp.innerText = Math.round((val) * 100) / 100;
    }
    set ping(val) {
        this.elPing.innerText = Math.round((val) * 100) / 100;
    }
    set jitter(val) {
        this.elJiiter.innerText = Math.round((val) * 100) / 100;
    }
    set sparkDownData(data) {
        sparkline(this.sparkDown, data);
    }
    set sparkUpData(data) {
        sparkline(this.sparkUp, data);
    }
}

let speedtestUi = new SpeedtestUi(150);

let demoData = [0];
let demoBase = 1;

function randNum(base) {
    return (Math.random() * 2) + base;    
}
  
function demoMode(){
    speedtestUi.btnText = 'Demo Mode :)';
    setInterval(function() {
        var num = randNum(demoBase);
        demoData.push(num);

        speedtestUi.mbitPerSec = num;
        speedtestUi.download = num;
        speedtestUi.upload = num;
        speedtestUi.ping = 23.4567;
        speedtestUi.jitter = 0.5432;
        speedtestUi.sparkDownData = demoData;
        speedtestUi.sparkUpData = demoData;

        if(demoBase < 10000){
            demoBase = demoBase * 1.1;
        }
    }, 250);
}

speedtestUi.elBtn.addEventListener("click", function() {
    demoMode();
});

document.addEventListener("DOMContentLoaded", function(event) {
    document.body.style.display = 'block';
});