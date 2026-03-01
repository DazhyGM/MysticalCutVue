package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.questions.ValidacionVerProducto;
import co.com.Mysticalcut.tasks.VerProducto;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;


import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class VerProductosStepDefinitions {

    @Cuando("^complete el inicio de sesion, se dirigira al apartado productos y podra ver todos los productos$")
    public void completeElInicioDeSesionSeDirigiraAlApartadoProductosYPodraVerTodosLosProductos() {
        theActorInTheSpotlight().attemptsTo(VerProducto.completarCampos());
    }


    @Entonces("^Verificar que salgan los productos que se encuentren agregados en MysticalCut$")
    public void verificarQueSalganLosProductosQueSeEncuentrenAgregadosEnMysticalCut() {
        theActorInTheSpotlight().should(seeThat(ValidacionVerProducto.Validacion()));

    }

}
