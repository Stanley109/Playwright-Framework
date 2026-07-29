// import {test} from '@playwright/test';   //since we are already using fixtures, this is not needed anymore
import {test} from '../utils/api-fixtures';
import {expect} from '@playwright/test';
import {createToken} from '../utils/api-token-helper'
import { validateSchema } from '../utils/api-schema-validator';

//Note: The UI website is https://conduit.bondaracademy.com/. If you want to check its corresponding api calls, open the network tab then refresh the webpage.
//Some of those api calls are the same api being tested here.

let authToken: string

test.beforeAll('Get Token', async({request}) => {        //'api' fixture came from the import {test} from api-fixtures.ts
    authToken = await createToken(request,"pwapiuser@test.com", "Welcome")
    console.log(authToken)
})

//Refresh the https://conduit.bondaracademy.com/ and you will get this equivalent api call in the website
test('Get Articles', {tag: ['@api', '@smoke', '@regression']}, async({api}) => {

    // const api = new RequestHandler()   //since we are already using fixtures, this is not needed anymore
    const response = await api
        //.url('https://random.com/api')
        .path('/articles')
        .params({limit:10, offset:0, foo:'bar'})
        .getRequest(200)

    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)  
})

test('Get Test Tags',{tag: ['@api', '@smoke', '@regression']}, async({api})=>{
    const response = await api
        .path('/tags')
        .getRequest(200)
    await validateSchema('tags','GET_tags', response)
    expect(response.tags[0]).toEqual('Test')
    expect(response.tags.length).toBeLessThanOrEqual(10)
            
})

test('Create and Delete Article',{tag: ['@api', '@smoke', '@regression']}, async({api}) => {
    //create an article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({"article": {"title":"TEST DATA 1","description":"Test Description 1", "body":"Test body","tagList":[]}})
        .postRequest(201)
    expect(createArticleResponse.article.title).toEqual('TEST DATA 1')
    const slugId = createArticleResponse.article.slug

    //view if article is created
    const getArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0})
        .getRequest(200)
    expect(getArticleResponse.articles[0].title).toEqual('TEST DATA 1')

    //delete the article
    await api
        .path(`/articles/${slugId}`)
        .headers({Authorization: authToken})
        .deleteRequest(204)
    
    //view if the article is really deleted
    const getArticleResponse2 = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0})
        .getRequest(200)
    
    console.log(`slug before is: ${getArticleResponse.articles[0].title}`)
    console.log(`slug now is: ${getArticleResponse2.articles[0].title}`)
    
    expect(getArticleResponse2.articles[0].title).not.toEqual('TEST DATA 1')
})

test('Create, Update, then Delete Article',{tag: ['@api', '@smoke', '@regression']}, async({api}) => {
    //create an article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({"article": {"title":"TEST DATA 1","description":"Test Description 1", "body":"Test body","tagList":[]}})
        .postRequest(201)
    expect(createArticleResponse.article.title).toEqual('TEST DATA 1')
    const slugId = createArticleResponse.article.slug

    //view if article is created
    const getArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0})
        .getRequest(200)
    expect(getArticleResponse.articles[0].title).toEqual('TEST DATA 1')
    console.log(`slug after create is: ${getArticleResponse.articles[0].title}`)

    //update the article
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body({"article": {"title":"TEST DATA 2","description":"Test Description 2", "body":"Test body 2","tagList":[]}})
        .putRequest(200)
    expect(updateArticleResponse.article.title).toEqual('TEST DATA 2')
    const slugIdNew = updateArticleResponse.article.slug

    //view if article is updated
    const getArticleResponse2 = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0})
        .getRequest(200)
    expect(getArticleResponse2.articles[0].title).toEqual('TEST DATA 2')
    console.log(`slug after update is: ${getArticleResponse2.articles[0].title}`)

    //delete the article
    const getDeleteResponse = await api
        .path(`/articles/${slugIdNew}`)
        .headers({Authorization: authToken})
        .deleteRequest(204)
    console.log(`delete response is: ${getDeleteResponse}`)
    
    //view if the article is really deleted
    const getArticleResponse3 = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0})
        .getRequest(200)
    expect(getArticleResponse3.articles[0].title).not.toEqual('TEST DATA 1')
    console.log(`slug after delete is: ${getArticleResponse3.articles[0].title}`)
})

