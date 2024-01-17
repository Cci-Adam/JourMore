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

async function affichePost(post){
        const tr = template.content.cloneNode(true); // Clonage du template dans tr
        const content = tr.querySelector('.post-content'); // Cible la classe post-content du template
        const auteur = tr.querySelector('.auteur'); // Cible la classe auteur du template
        const titre = tr.querySelector('h2'); // Cible la balise h2 du template
        const nbcomments = tr.querySelector('.post-comment-nb'); // Cible la classe post-comment-nb du template
        const img = tr.querySelector('.avatar'); // Cible la classe avatar du template (sera une image)
        const aff = tr.querySelector('.comment')

        post.comments.forEach(element => { //Je parcours chaque commentaire dur post
            aff.innerHTML += `<div class='post'><h2>${element.name}</h2><p>${element.body}</p><div>` //J'ajoute le titre et contenu du commentaire dans le HTML
            
        });

        img.src = `https://ui-avatars.com/api/?name=${post.author.name}&background=random`; // Je change la source de l'image avec en 'paramètre' le nom fr l'autheur;
        content.textContent = post.body; // Je met le body du poste dans la classe post-content du template
        auteur.textContent = post.author.name; // Je met le nom de l'autheur du poste dans classe auteur du template
        nbcomments.textContent = `${post.comments.length} commentaire`; // Je met le nombre de commentaire du poste dans la classe post-comment-nb du template
        titre.textContent= post.title; //Je met le titre du poste dans la balise h2 du template
        container.append(tr); // J'envoie la copie du template dans le container de poste
}


async function main() {
    const post = await getAutComByPost();
    for(let i = 0;i<post.length;i++) { // Boucle qui va passer sur chaque poste (Le poste de chaque itération sera appelé poste i)
        affichePost(post[i]) //J'affiche le poste i grâce à la function afficherPost
    }
}

main()