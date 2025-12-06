const m = new Map()

m.set("room",{
    abc : {
        score : 100
    },
    efg : {
        score : 105
    }
})


console.log("map",m.get('room')?.abc?.score)