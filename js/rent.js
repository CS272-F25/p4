const movieDivNode = document.getElementById("movie-list")

fetch("https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/075b6aaba5ee43554ecd55006e5d080a8acf08fe/Film.JSON")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            movieDivNode.append(createMovieComponent(element));
            console.log(element);
        });
        console.log(data)
    })
    .catch(error => console.error(error));


function createMovieComponent(movieData) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-12 col-sm-6 col-lg-4 col-xl-2 mb-4';
    
    const blockNode = document.createElement("div");
    blockNode.className = "card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const imgNode = document.createElement("img");
    imgNode.src = movieData.Images[2];
    imgNode.style = "max-width: 100%; height: auto;";
    imgNode.alt = movieData.Title + " Movie Poster";
    cardBody.append(imgNode);

    const titleNode = document.createElement("h2");
    titleNode.textContent = movieData.Title;
    cardBody.append(titleNode);

    let infoNode = document.createElement("p");
    infoNode.textContent = "By: " + movieData.Writer + " | Runtime of " + movieData.Runtime ;
    cardBody.append(infoNode);

    let descNode = document.createElement("p");
    descNode.textContent = movieData.Plot;
    cardBody.append(descNode);

    blockNode.append(cardBody);
    colDiv.append(blockNode);

    return colDiv;
}