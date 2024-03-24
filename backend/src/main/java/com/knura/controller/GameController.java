package com.knura.controller;

import com.knura.controller.dto.ConnectRequest;
import com.knura.exception.GameNotFoundException;
import com.knura.exception.InvalidGameException;
import com.knura.exception.InvalidParamException;
import com.knura.exception.NotFoundException;
import com.knura.model.Game;
import com.knura.model.GamePlay;
import com.knura.model.Player;
import com.knura.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import com.knura.config.WebSocketConfiguration;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
@CrossOrigin("*")
public class GameController {
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player){
        log.info("start game request: {}", player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest connectRequest) throws InvalidParamException, InvalidGameException {
        log.info("connect request: {}", connectRequest);
        return ResponseEntity.ok(gameService.connectToGame(connectRequest.getPlayer(), connectRequest.getGameId()));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectRandom(@RequestBody Player player) throws GameNotFoundException {
        log.info("connect random {}", player);
        return ResponseEntity.ok(gameService.connectToRandomGame(player));
    }

    @PostMapping("/gameplay")
    public ResponseEntity<Game> gamePlay(@RequestBody GamePlay gamePlayRequest) throws InvalidGameException, GameNotFoundException {
        log.info("gameplay: {}", gamePlayRequest);
        Game game = gameService.gamePlay(gamePlayRequest);
        simpMessagingTemplate.convertAndSend("/topic/gameprogress/" + game.getGameId(), game);
        return ResponseEntity.ok(game);
    }
}
