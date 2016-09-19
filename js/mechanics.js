var mechanics = {
    getdeltaX: function(a, v0, t){
        return (0.5 * a * Math.pow(t, 2)) + (v0 * t);
    },
    getV: function(a, v0, t){
        return (a * t) + v0;
    }
}