//1 is blue circle striped candy
//2 is green triangle no pattern candy
//3 is red square dotted candy

let arr1 = [
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,2,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1]];

let arr2 = [
    [1,1,1,1,1],
    [1,1,3,1,1],
    [1,3,2,3,1],
    [1,1,3,1,1],
    [1,1,1,1,1]];

function getLevel(level){
    switch(level){
        case 0: return arr1;
        case 1: return arr2;
    }
}