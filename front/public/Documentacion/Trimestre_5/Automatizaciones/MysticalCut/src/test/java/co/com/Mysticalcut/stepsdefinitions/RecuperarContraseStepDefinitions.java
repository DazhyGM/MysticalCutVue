package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.models.CredencialesRecuperarContrase;
import co.com.Mysticalcut.questions.ValidacionRecuperarContrase;
import co.com.Mysticalcut.tasks.AbrirPagina;
import co.com.Mysticalcut.tasks.AutenticarseRecuperarContrase;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class RecuperarContraseStepDefinitions {

    @Dado("^que el usuario se encuentra en la página de recuperar Contraseña$")
    public void queElUsuarioSeEncuentraEnLaPáginaDeRecuperarContraseña() {
        theActorInTheSpotlight().wasAbleTo(AbrirPagina.laPagina());

    }


    @Cuando("^ingresa su correo electrónico registrado y hace clic en el botón Enviar$")
    public void ingresaSuCorreoElectrónicoRegistradoYHaceClicEnElBotónEnviar(List<CredencialesRecuperarContrase> credencialesRecuperar) {
        theActorInTheSpotlight().attemptsTo(AutenticarseRecuperarContrase.aute(credencialesRecuperar));

    }

    @Entonces("^el sistema debe enviar un enlace de recuperación al correo ingresado y debe mostrarse un mensaje indicando que se ha enviado el correo exitosamente$")
    public void elSistemaDebeEnviarUnEnlaceDeRecuperaciónAlCorreoIngresadoYDebeMostrarseUnMensajeIndicandoQueSeHaEnviadoElCorreoExitosamente() {
        theActorInTheSpotlight().should(seeThat(ValidacionRecuperarContrase.ValidacionRecuperarContrase()));

    }

}
