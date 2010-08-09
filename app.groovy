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
}

RatpackServlet.serve(app,8080)

