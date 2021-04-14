require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('koa-router');

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = ["KEYS"];

  server.use(
    createShopifyAuth({
      apiKey: "KEY",
      secret: "SECRET",
      scopes: ['read_products', 'write_content', 'read_themes', 'write_themes'],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        ctx.cookies.set('accessToken', accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
      });
        ctx.redirect('/');
      },
    }),
  );

  router.post('/api/:object/:name', async (ctx) => {
    var JSbody = JSON.stringify({
      "page": {
        "title": ctx.params.name,
        "template_suffix": ctx.params.name
      }
    })
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-04/" + ctx.params.object + ".json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
        body: JSbody,
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })

  router.put('/api/:object', async (ctx) => {
    var JSbody = JSON.stringify({
      "asset": {
        "key": ctx.request.header.pagekey,
        "value": ctx.request.header.pagevalue
      }
    });
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-04/" + ctx.params.object + ".json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
        body: JSbody,
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })

  router.get('/api/:oa/:ob/:oc', async (ctx) => {
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-04/" + ctx.params.oa + "/" + ctx.params.ob + "/" + ctx.params.oc + ".json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })

  router.get('/api/pages/:id', async (ctx) => {
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-04/pages/" + ctx.params.id + ".json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })

  router.get('/api/:object', async (ctx) => {
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2020-04/" + ctx.params.object + ".json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })
  
  server.use(router.routes());
  server.use(graphQLProxy({version: ApiVersion.October19}))
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
