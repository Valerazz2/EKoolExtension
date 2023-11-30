var marksActive = false;
setInterval(showAverageMarks, 500);

document.addEventListener('keydown', function(event){
    if(event.key === 'f' || event.key === 'F')
    {
        var x = getFullTable();
        x = x.getElementsByTagName('tbody')[0];
        fillMarks(x);
    }
});

function getFullTable()
{
    var gradesheet =  "fulltable gradesheet velvet-table gray-headers kov";
    var tab = document.getElementsByClassName( gradesheet)[0];
    return tab;
}
function showAverageMarks()
{
   // if(marksActive) return;

    var fulltable = getFullTable();

    if(fulltable == null) return;
    marksActive = true;

    var thead = fulltable.getElementsByTagName('thead')[0].getElementsByTagName('tr')[1].getElementsByTagName('th')[1];
    thead.innerHTML = 'Средний бал';

    var body = fulltable.getElementsByTagName('tbody')[0];
    var tr = body.getElementsByTagName('tr');

    for(let i = 0; i < tr.length; i ++)
    {
        var elementTd = tr[i].getElementsByTagName('td')[2];
        var spans = elementTd.getElementsByTagName('span');

        var str = ' ';
        
        for(let j = 0; j < spans.length; j++)
        {
            var span2 = spans[j].getElementsByTagName('span')[0];
            if(span2 == null) continue;
            str += spans[j].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerText + ' ';
        }
        str = str.replaceAll(',', '.');
        console.log(str);
        let {grade, letGrade, apsentGrade, isFloat} = getMarkInfo(str);
        if(isNaN(grade) ||grade == null) continue;

        var finalStr = grade;
        grade = (+grade).toFixed(1);
        letGrade = (+letGrade).toFixed(1);
        apsentGrade = (+apsentGrade).toFixed(1);
        var sum = (+grade + +letGrade + +apsentGrade).toFixed(1);
        if(sum > 10) sum = 10;


        if((letGrade > 0 || apsentGrade > 0) && isFloat)
        {
            if(letGrade > 0) finalStr += ' + ' + letGrade + '(A, B)';
            if(apsentGrade > 0) finalStr += ' + ' + apsentGrade + '(p, h)';
            finalStr += ' => ' + sum;
        } 
        var tableData = tr[i].getElementsByTagName('td')[1];
        tableData.innerHTML = finalStr;
    }
}


function getMarkInfo(selection)
{
   let numsCount = 0;
   let sum = 0;
   var letGrade = 0;
   var apsentCount = 0;
   var apsentGrade = 0;
   var isFloat = false;
   const apsentChars = ['h', 'p', '-', 'v']
   for(var i = 0; i < selection.length; i++)
   {
       if (selection[i] >= '0' && selection[i] <= 9) 
       {
           let str = ' ';
           for (; selection[i] != ' '; i++)
           {
               str += selection[i];  
               if (i == selection.length - 1) break;        
           }
           sum += parseFloat(str);
           numsCount++;
           isFloat = str.includes('.');
       }
       if(selection[i] == 'M' && selection[i + 1] == 'a') numsCount++;

       if (selection[i] == 'A' || selection[i] == 'B') {
           letGrade += 0.1;
       }
       else if(selection[i] == 'C' || selection[i] == 'D'){
           letGrade -= 0.1;
       }

       if(apsentChars.includes(selection[i])) {
           apsentCount++;
       }
   }
   var grade = (sum / numsCount).toFixed(1);
   if(letGrade < 0) letGrade = 0;
   if(letGrade > 0.5) letGrade = 0.5;
   apsentGrade = apsentCount > 4 ? 0 : 0.5;
   return {grade, letGrade, apsentGrade, isFloat};
}

function getRandomMark(){
    let rand = Math.floor(Math.random() * 5);

    if(rand >= 4){
        let randomNumber = Math.random() * 10;
        let rounded = randomNumber.toFixed(1);
        if(rounded < 7) {rounded = (+rounded) + 3};
        return rounded;
    }
    if(rand <= 3 && rand != 0){
        const letters = ["A", "B", "C", "D"];
        var randLet = letters[Math.floor(Math.random() * 4)];
        return randLet;
    }
    
    if(rand == 0)
    {
        const aps = ['h', 'p', '-'];
        let randAps = aps[Math.floor(Math.random() * 3)];
        return randAps;
    }
    return null;
}
function fillMarks(body)
{
    var rows = body.getElementsByTagName('tr');

    var marksCount = Math.floor(Math.random() * 6) + 5;
    for(let j = 0; j < rows.length; j++)
    {
        var currentTr = rows[j].getElementsByTagName('td')[2];
        console.log(currentTr);
        for(let i = 0; i < marksCount; i++)
        {
            let randMark = getRandomMark();
            var mySpan = document.createElement('span');
            mySpan.innerHTML = randMark;
           setColor(randMark, mySpan);
            
            var secondSpan = document.createElement('span');
            secondSpan.innerHTML = ' , ';
            secondSpan.style.color = 'black';
            mySpan.appendChild(secondSpan);
            currentTr.appendChild(mySpan);
        }
    }
}
function setColor(mark, mySpan)
{
    const goodMarks = ['A', 'B', 'h', 'p', '-',];
    if(goodMarks.includes(mark) || mark >= 5.0)
    {
        mySpan.style.color = '#6a8ac8';
    }
    else mySpan.style.color = '#e52c38';
}

