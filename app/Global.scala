import org.squeryl.{Session, SessionFactory}
import org.squeryl.adapters.{PostgreSqlAdapter, H2Adapter}
import org.squeryl.internals.DatabaseAdapter
import play.api.{Application, GlobalSettings}
import play.api.mvc.{Handler, RequestHeader}
import play.api.db.DB

/**
 * Global settings
 */
object Global extends GlobalSettings{

  /**
   * Checks user access per each request.
   *
   * @param request Current request
   */
  override def onRequestReceived(request: RequestHeader): (RequestHeader, Handler) = {
    // TODO: add security
    super.onRequestReceived(request)
  }

  /**
   * Display the paginated list of programming languages.
   *
   * @param app Current application
   */

  override def onStart(app: Application): Unit = {
    SessionFactory.concreteFactory = app.configuration.getString("db.default.driver") match  {
      case Some("org.h2.Driver") => Some(() => getSession(new H2Adapter, app))
      case Some("org.postgresql.Driver") => Some(() => getSession(new PostgreSqlAdapter, app))
      case _ => sys.error("Database driver must be either org.h2.Driver or org.postgresql.Driver")
    }
  }

  /**
   * Creates session for specific db
   *
   * @param adapter Given adapter
   * @param app Current application
   */
  def getSession(adapter: DatabaseAdapter, app: Application) = Session.create(DB.getConnection()(app), adapter)

}
