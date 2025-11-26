package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.questions.ValidacionVisualizarUsuarios;
import co.com.Mysticalcut.tasks.VisualizarUsuariosAutenticarse;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;


import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class VisualizarUsuariosStepDefinitions {

    @Cuando("^complete el inicio de sesion, se dirigira al apartado usuarios y podra ver todos los usuarios$")
    public void completeElInicioDeSesionSeDirigiraAlApartadoUsuariosYPodraVerTodosLosUsuarios() {
        theActorInTheSpotlight().attemptsTo(VisualizarUsuariosAutenticarse.completarCampos());
    }


    @Entonces("^Verificar que salgan los usuarios que se encuentren registados en MysticalCut$")
    public void verificarQueSalganLosUsuariosQueSeEncuentrenRegistadosEnMysticalCut() {
        theActorInTheSpotlight().should(seeThat(ValidacionVisualizarUsuarios.ValidacionVisualizarUsuarios()));
    }

}
