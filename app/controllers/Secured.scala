package controllers

import play.mvc.Http.Context
import play.mvc.{Result, Security}

/**
 * Created by che85 on 12/29/14.
 */
class Secured extends Security.Authenticator {

  override def onUnauthorized(ctx: Context): Result = super.onUnauthorized(ctx)

  override def getUsername(ctx: Context): String = ctx.session().get("name")

}
