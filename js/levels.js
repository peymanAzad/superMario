var levels = [
    {
        main:{
            background:data.background,
            runner:{
                top:10,
                left:50,
                width:data.mario.right.idle[0].width,
                height:data.mario.right.idle[0].height,
                vector:"right",
                state: "idle"
            },
            platforms:[
                {
                    top:200,
                    left:400,
                    width:200,
                    height:16,
                    cell: data.well,
                    shape: "Rectangle"
                }
            ],
            grounds:[
                {
                    top:400-16*5,
                    left:0,
                    width:800-15,
                    height:16*5,
                    opacity:1
                }
            ]
        }
    }
]
