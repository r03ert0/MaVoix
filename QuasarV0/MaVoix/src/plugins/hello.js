import hello from 'hellojs'

export default ({ Vue }) => {
  hello.init({
    github: '2b6d0362308dadbe59a2'
  }, {
    redirect_uri: 'http://localhost:8080/redirect'
  })

  Vue.prototype.$hello = hello
}
