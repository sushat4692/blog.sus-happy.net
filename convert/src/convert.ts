import * as path from 'path'
import * as async from 'async'
import * as fs from 'fs'

const pagePath = path.resolve(__dirname + '/../../source')
const postPath = path.resolve(__dirname + '/../../source/_posts')
const draftPath = path.resolve(__dirname + '/../../source/_drafts')
const ghostData = require('../ghost.json')

const ghostPosts = ghostData.db[0].data.posts
const ghostTags = ghostData.db[0].data.tags
const ghostPostTags = ghostData.db[0].data.posts_tags

let relateTags = []
ghostTags.forEach((element) => {
  relateTags[element.id] = {
    name: element.name,
    slug: element.slug
  }
})

let relatePostTags = []
ghostPostTags.forEach((element) => {
  if(relatePostTags[element.post_id] === undefined) {
    relatePostTags[element.post_id] = []
  }
  relatePostTags[element.post_id].push(element.tag_id)
})

ghostPosts.forEach((element) => {

  const doc = JSON.parse(element.mobiledoc)
  if(doc) {
    const fileName = element.slug + '.md'

    let fileBody = ''
    fileBody += '---\n'
    fileBody += 'title: "' + element.title + '"\n'
    fileBody += 'date: ' + element.published_at + '\n'
    fileBody += 'updated: ' + element.updated_at + '\n'
    fileBody += 'tags: '+'\n'

    if(relatePostTags[element.id] !== undefined) {
      relatePostTags[element.id].forEach((tag_id) => {
        if(relateTags[tag_id] !== undefined) {
          fileBody += '  - ' + relateTags[tag_id].name + '\n'
        }
      })
    }

    fileBody += '---\n'
    fileBody += '\n'

    doc.cards.forEach((element) => {
      fileBody += element[1].markdown
    })

    if(element.page) {
      fs.writeFile(pagePath + '/' + element.slug + '/index.md', fileBody, () => {
        console.log('finished create Page file : ' + element.slug + '/index.md')
      })
    } else if(element.status === 'published') {
      fs.writeFile(postPath + '/' + fileName, fileBody, () => {
        console.log('finished create posted file : ' + fileName)
      })
    } else {
      fs.writeFile(draftPath + '/' + fileName, fileBody, () => {
        console.log('finished create drafted file : ' + fileName)
      })
    }
  }

});

