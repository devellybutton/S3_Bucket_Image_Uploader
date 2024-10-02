const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const noFileText = document.getElementById('noFileText');
const uploadButton = document.getElementById('uploadButton');

// 초기 상태: 업로드한 파일이 없습니다 메시지 표시
noFileText.style.display = 'block';

// 이미지 미리보기
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            noFileText.style.display = 'none'; // 파일이 선택되면 메시지 숨김
        };
        reader.readAsDataURL(file);

        // console.log('선택한 파일:', file.name);
        // console.log('이미지 업로드 시 Content-Type (MIME Type):', file.type);
    }
});

// 파일 업로드 버튼 클릭 시
uploadButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    console.log('S3 버킷에 업로드할 Content-Type (MIME Type):', file.type);
    
    if (!file) {
        alert('업로드할 파일을 선택해 주세요.');
        return;
    }

    // Presigned URL 요청
    const response = await fetch('http://localhost:3000/files/presigned-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileType: file.type })
    });

    if (!response.ok) {
        alert('Presigned URL을 가져오는 데 오류가 발생하였습니다.');
        return;
    }

    // JSON 데이터 파싱
    const responseData = await response.json();

    // console.log("Presigned URL 생성 응답", response);
    // console.log("Presigned URL 생성 응답 데이터", responseData);

    const { url, fields } = responseData;

    // S3에 파일 업로드
    const formData = new FormData();
    formData.append('Content-Type', file.type);

    // URL을 제외한 key의 value값을 모두 formData에 넣어주기
    // Content-Type도 명시적으로 formData에 넣어줘야함.    
    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
    });
    formData.append('file', file);

    // 여기서 formData에 Content-Type을 업로드하면 에러가 남.
    // formData.append('Content-Type', file.type);
    
    // FormData의 내용을 출력 (확인용)
    // 그냥 console.log 하면 아무것도 안 나옴.
    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }

    const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (uploadResponse.ok) {
        const fileUrl = `${url}/${fields['key']}`; // 업로드된 파일의 S3 URL
        console.log('파일이 성공적으로 업로드되었습니다:', fileUrl);
        alert('파일이 성공적으로 업로드되었습니다!');
    } else {
        const errorText = await uploadResponse.text(); 
        alert('파일 업로드에 실패했습니다');
        console.error("업로드 에러: ", errorText);
    }
});