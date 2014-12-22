import play.api.GlobalSettings
import play.api.mvc.{Handler, RequestHeader}

/**
 * Global settings
 */
object Global extends GlobalSettings{
  override def onRequestReceived(request: RequestHeader): (RequestHeader, Handler) = {
    // TODO: add security
    super.onRequestReceived(request)
  }
}
