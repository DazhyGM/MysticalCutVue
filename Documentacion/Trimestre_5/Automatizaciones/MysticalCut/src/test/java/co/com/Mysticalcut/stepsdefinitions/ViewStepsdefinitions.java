package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.questions.ValidacionesView;
import co.com.Mysticalcut.tasks.View;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class ViewStepsdefinitions {

    @Cuando("^Seleccionar el servicio$")
    public void seleccionarElServicio() {
        theActorInTheSpotlight().attemptsTo(View.completarCampos()
        );
    }


    @Entonces("^Verificarque sea el servicio seleccionado$")
    public void verificarqueSeaElServicioSeleccionado() {
        theActorInTheSpotlight().should(seeThat(ValidacionesView.validar()));
    }
}
