var config = {
  apiKey: "AIzaSyDYroT-bpWNIpkuUw2hp50ZCw2UD59V43Q",
  databaseURL: "https://urban-dictionary-pad.firebaseio.com/",
  projectId: "urban-dictionary-pad",
};

firebase.initializeApp(config);

const database = firebase.database()

const pageApp = {
  getPageBySlug (slug) {
    return database.ref('pages/')
      .orderByChild('slug')
      .equalTo(slug)
      .limitToFirst(1)
      .once('value')
      .then((snapshot) => {
        const val = snapshot.val()
        if (!val) {
          return null
        }

        const key = Object.keys(val)[0]
        return { id: key, ...val[key] }
      })
  },
  addPage (title, slug) {
    return database.ref('pages/')
      .push()
      .set({ title, slug, content: 'Start writing :)', timestamp: Date.now() })
      .then(() => slug)
  },
  saveContent (id, content) {
    return database.ref('pages/' + id)
      .update({ content })
  },
  getPages (startTimeStamp, limit) {
    return database.ref('pages/')
      .orderByChild('timestamp')
      .startAt(startTimeStamp)
      .limitToFirst(limit)
      .once('value')
      .then((snapshot) => snapshot.val())
  }
}
