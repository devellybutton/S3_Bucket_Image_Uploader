# S3 버킷 이미지 업로더

### 1. [기술 스택](https://github.com/devellybutton/S3_Bucket_Image_Uploader?tab=readme-ov-file#기술-스택)
### 2. [작동 순서](https://github.com/devellybutton/S3_Bucket_Image_Uploader?tab=readme-ov-file#작동-순서)
### 3. [참고사항](https://github.com/devellybutton/S3_Bucket_Image_Uploader?tab=readme-ov-file#참고사항)
### 4. [시연 GIF](https://github.com/devellybutton/S3_Bucket_Image_Uploader?tab=readme-ov-file#시연-GIF)

----

<p align="center">
    <img src="https://github.com/user-attachments/assets/e5726fea-76bb-4e3a-87df-b3cec5bbe50c" alt="화면 캡처" width="60%">
</p>

----

# 기술 스택
- HTML, CSS, JavaScript, Fetch API, AWS S3

-----

# 작동 순서 
1. 사용자가 로컬 컴퓨터에서 본인 컴퓨터에 있는 파일을 선택한다.
2. 선택된 이미지의 미리보기가 박스 안에 보여진다.
3. 밑에 있는 업로드 버튼을 눌러서 선택한 이미지를 Amazon S3에 업로드한다.

-----

# 참고사항
- input type="file" 태그의 '선택된 파일 없음' 이라는 문구가 거슬려서  그 위에 버튼을 만들고 input 태그는 CSS로 숨겨놓았음. 
- 요청을 두 번 보내야 함.

| no | Method | request body                     | Endpoint                                        |
|----|--------|----------------------------------|-------------------------------------------------|
| 1  | POST   | ```{ "fileType": file.type }```     | 서버의 presigned url 생성하는 엔드포인트      |
| 2  | POST   | `formData`                      | 위 1번 요청의 response로 받은 URL               |

- 서버의 presigned URL 생성 코드 중 conditions에서 Content-Type 조건을 설정하였을 경우, 프론트엔드에서 form Data를 생성한 다음 formData에 content-type을 명시적으로 넣어주어야 함. 
<details>
<summary><i>예시) 서버의 conditions 중 '$Content-Type' 부분</i></summary>

```
        Bucket: bucket, // 생성한 버킷 이름
        Key: key, //생성된 키
        Conditions: [
          ['content-length-range', 0, 20971520], // 최대 20MB
          ['starts-with', '$Content-Type', fileType],
        ],
        Expires: 60, // 유효기간(초 단위)
```
</details>

<details>
<summary><i>예시) 프론트엔드의 formData 생성 코드</i></summary>

```
    // S3에 파일 업로드
    const formData = new FormData();
    formData.append('Content-Type', file.type);
```

</details>

---

# 시연 GIF
<p align="center">
    <img src="https://github.com/user-attachments/assets/e15ff6c4-a77c-48f3-8952-0bc17e54346c" alt="시연 GIF" width="60%">
</p>

---

# 참고 링크

<details>
<summary>presigned URL 생성 (NestJS 서버 코드 포함)</summary>

- https://www.adarsha.dev/blog/aws-s3-nestjs
- https://advancedweb.hu/how-to-use-s3-post-signed-urls/
- https://velog.io/@davidktlee/S3-presigned-url-%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%82%AC%EC%A7%84-%EC%97%85%EB%A1%9C%EB%93%9C

</details>

<details>
<summary>presigned URL content type conditions 관련</summary>

- https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
- https://pizza7311.me/post/dev/s3-createPresignedPost

</details>

<details>
<summary>input type="file" 관련</summary>

- https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/file
- https://studyingpingu.tistory.com/60

</details>
