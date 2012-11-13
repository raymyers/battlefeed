import com.bleedingwolf.ratpack.Ratpack
import com.bleedingwolf.ratpack.RatpackServlet
import com.cadrlife.jhaml.JHaml
import org.apache.commons.lang.StringEscapeUtils
import groovy.text.GStringTemplateEngine

def haml(String filename) {
	new JHaml().parse(new File(filename).text)
}

def app = Ratpack.app {
    set "public", "public"
    get("/") {
        setHeader 'Content-Type', 'text/html'
        haml "views/index.haml"
    }
    get("/redesign") {
        setHeader 'Content-Type', 'text/html'
        haml "views/index-redesign.haml"
    }
    get("/vault") {
        setHeader 'Content-Type', 'text/html'
        haml("views/vault.haml").replace("DEFAULT_BATTLER", params.battler ?: "dumbfoundead")
    }
    get("/lore") {
        setHeader 'Content-Type', 'text/html'
        haml "views/vault.haml"
    }
    get("/nocoast") {
        setHeader 'Content-Type', 'text/html'
        haml "views/nocoast-home.haml"
    }
}

RatpackServlet.serve(app,5000)

