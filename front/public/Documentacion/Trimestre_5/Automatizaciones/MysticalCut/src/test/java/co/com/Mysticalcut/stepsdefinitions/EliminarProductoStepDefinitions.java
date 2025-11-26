package co.com.Mysticalcut.stepsdefinitions;

import co.com.Mysticalcut.questions.ValidacionVerProducto;
import co.com.Mysticalcut.tasks.EliminarProducto;
import co.com.Mysticalcut.tasks.VerProducto;
import co.com.Mysticalcut.tasks.VisualizarUsuariosAutenticarse;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;


import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class EliminarProductoStepDefinitions {

    @Cuando("^complete el inicio de sesion, se dirigira al apartado productos y podra ver todos los productos con su boton eliminar$")
    public void completeElInicioDeSesionSeDirigiraAlApartadoProductosYPodraVerTodosLosProductosConSuBotonEliminar() {
        theActorInTheSpotlight().attemptsTo(EliminarProducto.completarCampos());

    }


    @Entonces("^Verificar que el producto se encuentre inactivo en MysticalCut$")
    public void verificarQueElProductoSeEncuentreInactivoEnMysticalCut() {

    }

}
