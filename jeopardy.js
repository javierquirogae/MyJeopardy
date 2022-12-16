
let categories = [];
const $table = $("#jeopardy");
const $thead = $("thead");
const $tbody = $("tbody");
const $start = $("#start");
const $tr100 = $("#0");
const $tr200 = $("#1");
const $tr300 = $("#2");
const $tr400 = $("#3");
const $tr500 = $("#4");
const $spin = $("#spin-container");
let table = [];

$table.hide();
$spin.hide();
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getOneCategoryId(){

    let thisRandNum = Math.round(Math.random()*999);
    try{
        const response100 = await axios.get(
            `https://jservice.io/api/clues?category=${thisRandNum}&value=100`
            );
        const response200 = await axios.get(
            `https://jservice.io/api/clues?category=${thisRandNum}&value=200`
            );
        const response300 = await axios.get(
            `https://jservice.io/api/clues?category=${thisRandNum}&value=300`
            );
        const response400 = await axios.get(
            `https://jservice.io/api/clues?category=${thisRandNum}&value=400`
            );
        const response500 = await axios.get(
            `https://jservice.io/api/clues?category=${thisRandNum}&value=500`
            );
        // console.log(response500.data[0]);
        if( response100.data[0] &&
            response200.data[0] &&
            response300.data[0] && 
            response400.data[0] && 
            response500.data[0]){
                console.log(`found category : ${response100.data[0].category.title}`);
                return thisRandNum;
            }
            
    }
    catch{
        console.log(`${thisRandNum} did not work`);
    }
}

async function getCategoryIds() {
    console.log("getting categories...");
    const NUM_CATEGORIES = [];
    while(NUM_CATEGORIES.length<6){ 
        let id = await getOneCategoryId();
        if(id){
            NUM_CATEGORIES.push(id);
        }
    }
    console.log('categories by id');
    console.log(NUM_CATEGORIES);
    let unique_NUM_CATEGORIES = [...new Set(NUM_CATEGORIES)];
    while(unique_NUM_CATEGORIES.length<6){ 
        let id = await getOneCategoryId();
        if(id){
            unique_NUM_CATEGORIES.push(id);
            console.log(`replacing the duplicate with ${id}`);
        }
    }
    console.log('unique categories by id');
    console.log(unique_NUM_CATEGORIES);
    return unique_NUM_CATEGORIES;
}

async function getCategory(catId) {
    
    let clueArray = [];
    const response_100 = await axios.get(
        `https://jservice.io/api/clues?category=${catId}&value=100`
        );
    clueArray.push({
        category: response_100.data[0].category.title,
        question: response_100.data[0].question,
        answer: response_100.data[0].answer,
        value: response_100.data[0].value,
        showing: 'value'
    });
    const response_200 = await axios.get(
        `https://jservice.io/api/clues?category=${catId}&value=200`
        );
    clueArray.push({
        category: response_200.data[0].category.title,
        question: response_200.data[0].question,
        answer: response_200.data[0].answer,
        value: response_200.data[0].value,
        showing: 'value'
    });
    const response_300 = await axios.get(
        `https://jservice.io/api/clues?category=${catId}&value=300`
        );
    clueArray.push({
        category: response_300.data[0].category.title,
        question: response_300.data[0].question,
        answer: response_300.data[0].answer,
        value: response_300.data[0].value,
        showing: 'value'
    });
    const response_400 = await axios.get(
        `https://jservice.io/api/clues?category=${catId}&value=400`
        );
    clueArray.push({
        category: response_400.data[0].category.title,
        question: response_400.data[0].question,
        answer: response_400.data[0].answer,
        value: response_400.data[0].value,
        showing: 'value'
    });
    const response_500 = await axios.get(
        `https://jservice.io/api/clues?category=${catId}&value=500`
        );
    clueArray.push({
        category: response_500.data[0].category.title,
        question: response_500.data[0].question,
        answer: response_500.data[0].answer,
        value: response_500.data[0].value,
        showing: 'value'
    });
    return clueArray;
}

async function fillTable() {
    $spin.show();
    $thead.empty();
    $tr100.empty();
    $tr200.empty();
    $tr300.empty();
    $tr400.empty();
    $tr500.empty();
    (async () => {
        let catIDs = await getCategoryIds();
        
        console.log("building table...");
        let $tr = $("<tr></tr>")
        for (let id of catIDs) {
            let thisCat = await axios.get(
                `https://jservice.io/api/category?id=${id}`
                );
            let $catTitle = $(`
                <td>
                    ${thisCat.data.title} 
                </td>
                `);
            $tr.append($catTitle);  
        }
        $thead.append($tr);
        let rowOf100 = [];
        let rowOf200 = [];
        let rowOf300 = [];
        let rowOf400 = [];
        let rowOf500 = [];
        for (let column=0; column< catIDs.length;column++) {
            let clueArr = await getCategory(catIDs[column]);
            let dollarRow = 0;
            for (let val of clueArr) {
                let $thisTr = $(`#${dollarRow}`);
                let $thisVal = $(`
                    <td id="${dollarRow} -- ${column}">
                        $${val.value} 
                    </td>
                `);
                if(val.value==100){
                    rowOf100.push(val);
                }
                if(val.value==200){
                    rowOf200.push(val);
                }
                if(val.value==300){
                    rowOf300.push(val);
                }
                if(val.value==400){
                    rowOf400.push(val);
                }
                if(val.value==500){
                    rowOf500.push(val);
                }
                $thisTr.append($thisVal);  
                dollarRow++;
            }
        }   
        table = [rowOf100,rowOf200,rowOf300,rowOf400,rowOf500];
        console.log("Table built !!");
        $table.show(); 
        $spin.hide();
    })();
     
}


$tbody.on("click", function (evt) {
    let target = evt.target;
    let targetID = target.id;
    let coordinates = targetID.match(/\d/g);
    handleClick(target, coordinates);
  });

function handleClick(t, c) {
    let tableItem = table[c[0]][c[1]];

    if(tableItem.showing == "value"){
        tableItem.showing = "question";
        console.log(tableItem);
        const text = tableItem.question;
        t.innerHTML = text;
        t.className = "question";
    }
    else if(tableItem.showing == "question"){
        tableItem.showing = "answer";
        console.log(tableItem);
        const text = tableItem.answer;
        t.innerHTML = text;
        t.className = "answer";
    }
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

$start.on("click", function () {
    $table.hide();
    fillTable();
  });

