# 3131498-JeremyROBERT-BSCH-ET-FinalProject

Final Assignment of Emerging Technologies class at Griffith College. Create an online code compiler

![Web Page to write C code](screenshots/Create-C-Code.png)
![Web Page to write Java code](screenshots/Create-Java-Code.png)
![Web Page to write Python code](screenshots/Create-Python-Code.png)

# How to run

## Docker stack

Create a stack

```
$> docker swarm init
```

Start the project using docker stack command:

```
$> docker stack deploy --compose-file docker-stack.yml web-compiler
```

Check everything is running:

```
$> docker stack ls
$> docker stack ps web-compiler
```

> It should be available at: [http://localhost:8000](http://localhost:8000)

Stop the running stack

```
$> docker stack rm web-compiler
```
