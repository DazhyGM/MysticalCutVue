package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.models.CredencialesInicioSesion;
import co.com.Mysticalcut.questions.ValidacionLogin;
import co.com.Mysticalcut.tasks.AbrirPagina;
import co.com.Mysticalcut.tasks.AutenticarseAdmin;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class AutenticacionMysticalStepDefinitions {

    @Dado("^que el usuario se encuentra en la pagina de inicio de sesion de Mystical$")
    public void queElUsuarioSeEncuentraEnLaPaginaDeInicioDeSesionDeMystical() {
        theActorInTheSpotlight().wasAbleTo(AbrirPagina.laPagina());

    }

    @Cuando("^ingrese las credenciales correctas \\(usuario y contrasena\\)$")
    public void ingreseLasCredencialesCorrectasUsuarioYContrasena(List<CredencialesInicioSesion> credenciales) {
        theActorInTheSpotlight().attemptsTo(AutenticarseAdmin.aute(credenciales));
    }

    @Entonces("^se debe verificar que el usuario haya sido autenticado correctamente y redirigido a su pagina de inicio de Mystical$")
    public void seDebeVerificarQueElUsuarioHayaSidoAutenticadoCorrectamenteYRedirigidoASuPaginaDeInicioDeMystical() {
        theActorInTheSpotlight().should(seeThat(ValidacionLogin.validacionLogin()));
    }

}
