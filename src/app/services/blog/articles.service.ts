import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Article } from 'src/app/models/Article.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  articles: Article[] = [];
  articlesSubject = new Subject<Article[]>();

  constructor() { }

  emitArticles() {
    this.articlesSubject.next(this.articles);
  }

  saveArticles() {
    firebase.database().ref('/blog/articles').set(this.articles);
  }

  getArticles() {
    firebase.database().ref('/blog/articles').on('value', (data) => {
      this.articles = data.val() ? data.val() : [];
      this.emitArticles();
    });
  }

  getSingleArticle(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/blog/articles/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewArticle(newArticle: Article) {
    this.articles.push(newArticle);
    this.saveArticles();
    this.emitArticles();
  }

  removeArticle(id) {
    this.articles.splice(id, 1);
    this.saveArticles();
    this.emitArticles();
  }

  updateArticle(article: Article, id: number) {
    firebase.database().ref('/blog/articles/' + id).update(article);
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/blog/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            //resolve(upload.snapshot.downloadURL);
            upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              resolve(downloadURL);
            });
          }
        );
      }
    );
  }

  deleteFile(url) {
    if (url) {
      const storageRef = firebase.storage().refFromURL(url);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.log('File not found : ' + error);
        }
      );
    }
  }

}
