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
                    top:100,
                    left:400,
                    width:200,
                    height:100,
                    cell: data.well,
                    shape: "Rectangle"
                }
            ],
            grounds:[
                {
                    top:300,
                    left:0,
                    width:800,
                    height:100,
                    opacity:1
                }
            ]
        }
    }
]
