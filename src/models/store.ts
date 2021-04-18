import { getDvaApp } from "umi"

const app = getDvaApp()

app.model(require('./user').default)
app.model(require('./breadcrumb').default)
app.model(require('./login').default)