package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.models.CredencialesBuscarUsuario;
import co.com.Mysticalcut.questions.ValidacionBuscarUsuario;
import co.com.Mysticalcut.questions.ValidacionVisualizarUsuarios;
import co.com.Mysticalcut.tasks.BuscarUsuario;
import cucumber.api.java.ast.Cuando;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class BuscarUsuarioStepDefinitions {

    @Cuando("^complete el inicio de sesion, se dirigira al apartado usuarios y podra ver el usuario en especifico$")
    public void completeElInicioDeSesionSeDirigiraAlApartadoUsuariosYPodraVerElUsuarioEnEspecifico(List <CredencialesBuscarUsuario> credencialesBuscar) {
        theActorInTheSpotlight().attemptsTo(BuscarUsuario.completarCampos(credencialesBuscar));
    }


    @Entonces("^Verificar que se filtre correctamente el usuario que esta registrado en MysticalCut$")
    public void verificarQueSeFiltreCorrectamenteElUsuarioQueEstaRegistradoEnMysticalCut() {
        theActorInTheSpotlight().should(seeThat(ValidacionBuscarUsuario.ValidacionBuscarUsuario()));
    }

}
