

var displayHighScores = function(){
    var highScoreArray = []
    for (i=0; i<localStorage.length; i++){
        highScoreArray.push(localStorage.key(i));
    }
    var sortedArray = highScoreArray.sort(function(x,y){return y-x;});

    var high1 = document.getElementById("highscore1");
    var high2 = document.getElementById('highscore2');
    var high3 = document.getElementById('highscore3');
    var name1 = document.createTextNode(sortedArray[0]+" : "+localStorage.getItem(sortedArray[0]));
    var name2 = document.createTextNode(sortedArray[1]+" : "+localStorage.getItem(sortedArray[1]));
    var name3 = document.createTextNode(sortedArray[2]+" : "+localStorage.getItem(sortedArray[2]));
 
    if (sortedArray[0]!== undefined)
         high1.appendChild(name1);
    if (sortedArray[1]!== undefined) 
        high2.appendChild(name2);
    if (sortedArray[2]!== undefined)
        high3.appendChild(name3);
}

var userName 
if (localStorage.getItem('-1') == null){
    var randomNameList = ['Leo Euler', 'Pedro Laplace', 'Joe Lagrange', 'Bill Hamilton','Mystery Person']
    userName = randomNameList[Math.floor(Math.random()*randomNameList.length)]
} else {
    userName = localStorage.getItem('-1');
}



