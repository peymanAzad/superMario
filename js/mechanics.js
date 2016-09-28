var mechanics = {
    getdeltaX: function(a, v0, t){
        return (0.5 * a * Math.pow(t, 2)) + (v0 * t);
    },
    getV: function(a, v0, t){
        return (a * t) + v0;
    },
    isPlatformUnderSprite(sprite, platform){
        if(sprite.left + sprite.width > platform.left && sprite.left < platform.left + platform.width){
            if (sprite.top + sprite.height >= platform.top && sprite.top < platform.top + platform.height){
                sprite.top = platform.top - sprite.height;
                return true;
            }
            else return false;
        }else{
            return false;
        }
    }
}