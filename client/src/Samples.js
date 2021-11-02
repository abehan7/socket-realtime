// get방식으로 데이터 받아오는 방법
// 맨 처음에 검색을 위해서 이름만 뽑아올 때
app.get("/hi", (req, res) => {
  const sqlSelect =
    "SELECT S_NAME,S_ADDR,S_AMENITY FROM SPOTS WHERE S_NAME IS NOT NULL";
  db.query(sqlSelect, (err, result) => {
    if (err) console.log(err);
    res.json(result);
  });
});

// post 방식으로 데이터 전송해서 받아오는 방법
app.post("/hello", (req, res) => {
  const sqlSelect = "SELECT * FROM SPOTS WHERE S_NAME = ?";
  db.query(sqlSelect, req.body.chosenOne, (err, result) => {
    console.log(result);
    res.json(result);
  });
});

/// html 에서 데이터 요정하는 방법 hi에서 res해준 데이터를 받아옴
axios.get("http://localhost:3001/hi").then((response) => {
  console.log(response.data);
});
