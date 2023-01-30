//To-do 는 해보면 좋을 것들


/** 문의하기 관련 */
//1. 문의하기에서 '제출이 완료되었습니다.' live alert 깨우기
// https://getbootstrap.com/docs/5.2/components/alerts/#live-example
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('liveAlertBtn')
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    alert('제출이 완료되었습니다.', 'success')
  })
}

function submit(){
    //2. 제출하기 버튼 눌렀을 때 제출 값 가져오기
    const name = document.getElementById('recipient-name').value; //성함
    const email = document.getElementById('recipient-email').value; //이메일
    const question = document.getElementById('recipient-question').value; //질문
    console.log({ name: name, email: email, question: question});
    return { name: name, email: email, question: question}; 
    // To-do 이제 여기 입력한 값을 어디론가 쏴야하는데..ㅎ
}


/** 가이드 검색 관련  */

//언어, 가이드 타입 설정 바뀌었을 때
function changeValue() {
    const selected_lang = document.getElementById("lang").value;
    const selected_guidetype = document.getElementById("Guide_type").value;
    //console.log({lang: selected_lang, Guide_type: selected_guidetype});
    return {lang: selected_lang, Guide_type: selected_guidetype} ;
    /** 번외 (메모)
    const changeValue = (target) => {
        // 선택한 option의 value 값
        console.log(target.value);
        
        // 메모: option의 text 값
        //console.log(target.options[target.selectedIndex].text);
    }
    */
}


//search 버튼 눌렀을 때
function search() {
    const selected = changeValue()
    const keyword = document.getElementById("search").value;
    selected.keyword = keyword;
    console.log(selected);
    console.log(selected.lang, selected.Guide_type, selected.keyword);

    //선택 값 저장
    const lang = selected.lang;
    const guidetype = selected.Guide_type || "all";
    const search_keyword = selected.keyword;

    //API 호출
    const url = `https://front-api.airbridge.io/api/search/v1/${guidetype}`;
    console.log(url);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "query" : search_keyword,
                "locale" : lang,
                /** option 적용 안함 
                "options" : {
                     "highlight" : true
                } */
            })
    })
    .then(response => response.text())
    .then(result => {
        const results = JSON.parse(result);
        //console.log(results)

        const filtered_developer = results.filter((element, index) => { // 개발자 가이드 상위 6개
            if (element.from == "Developer Guide") {
                if (index < 6) {
                    console.log(element)
                    return true; 
                }
            }
            
        })

        //유저 가이드 출력 값 바꾸기
        function changeUserGuide() {
            // 유저 가이드 상위 6개 출력
            const filtered_user = results.filter((element, index) => {
                if (element.from == "User Guide") {  return true; } })
           const filtered_user_six = filtered_user.filter((element, index) => {
               if (index < 6) { return true; } 
           })

           // 유저 가이드 값 변경
           if (filtered_user_six.length > 0) {
                userguide_result = "";
                for (i=0; i < filtered_user_six.length;i++) {
                    userguide_result += `    
                        <div class="col">
                            <div class="card border-white">
                                <div class="card-body">`;
                    userguide_result+= '<h5 class="card-title">' + filtered_user_six[i].title + '</h5>'; //제목
                    userguide_result+= '<p class="card-text">' + filtered_user_six[i].description + '</p>'; //내용
                    userguide_result+= '<a href="' + filtered_user_six[i].url +'" class="btn btn-outline-primary card-url">더 알아보기</a>';
                    userguide_result+='</div> </div> </div>'
                }
                //console.log(userguide_result);
                document.getElementById("User Guide").innerHTML = userguide_result;
           } else { //값이 없으면 검색결과가 없습니다. 출력
            document.getElementById("User Guide").innerHTML = "<p>검색 결과가 없습니다. (」゜ロ゜)」</p>";
           }
        }
        changeUserGuide();

        function changeDeveloperGuide() {
            // 유저 가이드 상위 6개 출력
            const filtered_developer = results.filter((element, index) => {
                if (element.from == "Developer Guide") {  return true; } })
           const filtered_developer_six = filtered_developer.filter((element, index) => {
               if (index < 6) { return true; } 
           })

           // 유저 가이드 값 변경
           if (filtered_developer_six.length > 0) {
                developerguide_result = "";
                for (i=0; i < filtered_developer_six.length;i++) {
                    developerguide_result += `    
                        <div class="col">
                            <div class="card border-white">
                                <div class="card-body">`;
                    developerguide_result+= '<h5 class="card-title">' + filtered_developer_six[i].title + '</h5>'; //제목
                    developerguide_result+= '<p class="card-text">' + filtered_developer_six[i].description + '</p>'; //내용
                    developerguide_result+= '<a href="' + filtered_developer_six[i].url +'" class="btn btn-outline-primary card-url">더 알아보기</a>';
                    developerguide_result+='</div> </div> </div>'
                }
                //console.log(userguide_result);
                document.getElementById("Developer Guide").innerHTML = developerguide_result;
           } else { //값이 없으면 검색결과가 없습니다. 출력
            document.getElementById("Developer Guide").innerHTML = "<p>검색 결과가 없습니다. (」゜ロ゜)」</p>";
           }
        }
        changeDeveloperGuide();
    });
}

//웹페이지 처음 로드될 때 가이드 생성하기
window.onload = search();


