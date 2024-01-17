const container = document.getElementById(`posts-container`); // Cible le container de post
const template = document.getElementById(`posttemp`);  // Recupère le template


async function getPost() { //Fonction qui recupère les posts
    const post = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await post.json();
    return data;
}

async function getAuthor(){ //Fonction qui recupère l'autheur du poste passer en paramètre
    const author = await fetch(`https://jsonplaceholder.typicode.com/users`) // Recupere l'autheur selon l'userId du post
    const data = await author.json();
    return data;
}

async function getComments(){ //Fonction qui recupère les commentaires du poste
    const comments = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    const data = await comments.json();
    return data
}

async function getAutComByPost(){
    const author = await getAuthor();
    const comments = await getComments();
    const post = await getPost();
    const fullPost = post.map(function(element) {
        const commentPost = comments.filter((com) => element.id == com.postId)
        const authorPost = author.filter((aut) => element.userId == aut.id)
        element.author = authorPost[0];
        element.comments = commentPost;
        return element
    });
    return fullPost
}

function toggleComments(postId) {
    console.log(postId)
    x=document.getElementById(postId)
    x.classList.toggle('anim')
}

async function affichePost(post){
    const tr = template.content.cloneNode(true); // Clonage du template dans tr
    tr.querySelector('.post').id = `post-${post.id}` 
    tr.querySelector('.post-content').textContent = post.body; ; // Cible la classe post-content du template
    tr.querySelector('.auteur').textContent = post.author.name;; // Cible la classe auteur du template
    tr.querySelector('h2').textContent= post.title;; // Cible la balise h2 du template
    tr.querySelector('.post-comment-nb').textContent = `${post.comments.length} commentaire`;; // Cible la classe post-comment-nb du template
    tr.querySelector('.avatar').src = `https://ui-avatars.com/api/?name=${post.author.name}&background=random`; // Cible la classe avatar du template (sera une image)
    const aff = tr.querySelector('.comment')

    tr.querySelector('.post').addEventListener('click',function() {
        toggleComments(`post-${post.id}`)
    })

    post.comments.forEach(element => { //Je parcours chaque commentaire dur post
        aff.innerHTML += `<div><h2>${element.name}</h2><p>${element.body}</p><div>` //J'ajoute le titre et contenu du commentaire dans le HTML
        
    });
    
//Je met le titre du poste dans la balise h2 du template
    container.append(tr); // J'envoie la copie du template dans le container de poste
}


async function main() {
    const post = await getAutComByPost();
    for(let i = 0;i<post.length;i++) { // Boucle qui va passer sur chaque poste (Le poste de chaque itération sera appelé poste i)
        affichePost(post[i]) //J'affiche le poste i grâce à la function afficherPost
        const lol = document.getElementsByClassName('post')
        lol[i].style.top = `${Math.floor(Math.random()*1080)}px`
        lol[i].style.left = `${Math.floor(Math.random()*1920)}px`
    }
}

main()