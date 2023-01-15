import { Component, OnInit, ViewChild } from '@angular/core';
import { QUIL_MODULES } from 'src/app/app.module';
import { DialogComponent, Drawer } from '../../common/common.component';
import { IdGen } from '../../common/common.service';
import { TaskService, Task, TaskList, Label } from './task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild('drawer') drawer!: Drawer;
  @ViewChild('dialog') dialog!: DialogComponent;
  comment!: string;
  qmodules = QUIL_MODULES;
  
  lists: TaskList [] = [ new TaskList('To Do'), new TaskList('In Progress'), new TaskList('Done')];
  tasks: Task [] = [
    new Task('t1 t1', 'To Do'), 
    new Task('t2 t2', 'To Do'), 
    new Task('t3 t3', 'To Do'), 
    new Task('t4 t4', 'To Do'), 
  ];

  task!: Task;
  labels: Label [] = [
    {name: 'tag1', color:'green'}, 
    {name: 'tag2', color:'#ff0000'}, 
    {name: 'tag3', color:'#00ff00'}, 
    {name: 'tag4', color:'#0000ff'}, 
  ];

  lcnt: number = this.lists.length + 1;
  tcnt: number = this.tasks.length + 1;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  onDrag(ev:any, tid: string){
    console.log('onDrag', tid, ev);
    if(ev.type == 'touchend' ){
      let touch = ev.touches[0] || ev.changedTouches[0];
      ev.tid = tid;
      ev.x = touch.pageX - 120;
      if(ev.x < 10) ev.x = 10;
      ev.y = touch.pageY;
    }else
      ev.dataTransfer.setData('tid', tid);
  }
  
  onDrop(ev: any) {
    console.log("onDrop", ev, ev.target.id, ev.target.className);
    if(ev.preventDefault) ev.preventDefault();
    let targetLst: any = ev.target;
    let toTask!: Task;
    while(targetLst.className?.indexOf('list') < 0){
      if(targetLst.className?.indexOf('task') >= 0) toTask = targetLst;
      targetLst = targetLst.parentElement;
      console.info(targetLst);
    }
    let tolst = this.lists.find(lst => lst.name == targetLst.id);
    if(!tolst) return;
    // console.info(ev);
    let tid: string;
    if(ev.type == 'touchend') 
      tid = ev.tid;
    else
      tid = ev.dataTransfer.getData('tid');
    console.log("onDrop", tid, ' => ', tolst, toTask?.id);
    let idx = this.tasks.findIndex(t => t.id == tid);
    if(idx >= 0) {
      let task = this.tasks[idx];
      if(task.status == tolst.name && toTask && toTask.id != task.id){//same list
        console.log("move", tid, task);
        this.tasks.splice(idx, 1);
        idx = this.tasks.findIndex(t => t.id == toTask?.id);
        if(idx >= 0)
          this.tasks.splice(idx, 0, task);
      }else 
        task.status = tolst.name;
    }

    for(let i=0;i<this.tasks.length; i++){
      let t = this.tasks[i];
      if(t.id == tid) {
        if(tolst.name == toTask?.status){
          console.log("move", tid, t);
          this.tasks.splice(i, 0, toTask);
        }else
          t.status = tolst.name;
        console.log("onDrop", tid, t);
        break;
      }
    }
  }

  allowDrop(ev: any) {
    if(ev.preventDefault) ev.preventDefault();
  }

  editable: any = {};
  isEditable(idx: any){
    return this.editable[idx]?this.editable[idx]: false;
  }

  makeEditable(ev: MouseEvent, idx: any){
    console.log('makeEditable', idx);
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
    this.editable[idx] = true;
  }

  editName(ev:any, item: any){
    console.log('editName', ev, item, item instanceof TaskList);
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
    this.editable[item.name] = false;
    const prev = item.name;
    item.name = ev.value;
    if(item instanceof TaskList){
      this.tasks.map(t => t.status = t.status == prev? item.name: t.status);
    }
    this.show(ev);
  }

  editDetail(ev:any, task: Task){
    // console.log('editDetail', ev, ev.target.innerText);
    if(ev.preventDefault) ev.preventDefault();
    this.editable[task.id] = false;
    this.show(ev);
  }

  edit(ev:any, task:Task){
    this.comment = '';
    if(ev.stopPropagation) ev.stopPropagation();
    this.task = task;
    if(task)
        this.drawer.open();  
  }

  remove(ev:any, task:Task){
    if(ev.stopPropagation) ev.stopPropagation();
    let idx = this.tasks.findIndex(t => t.id == task.id);
    if(idx >= 0)
      this.tasks.splice(idx, 1);
  }

  rm(ev:any, lst:TaskList){
    if(ev.stopPropagation) ev.stopPropagation();
    let idx = this.lists.findIndex(l => l.name == lst.name);
    if(idx >= 0){

      this.lists.splice(idx, 1);
    }
  }

  addComment(ev:any){
    this.comment = '';
    console.log('addComment', ev);  
    if(!this.task.comments) this.task.comments = [];
    this.task.comments.push({des: ev.value, by:''});  
  }

  rmComment(idx: number){
    this.task.comments.splice(idx, 1);
  }

  add(ev: any, lst: TaskList){
    if(ev.stopPropagation) ev.stopPropagation();
    this.tasks.push(new Task(`Untitled-${this.tcnt++}`, lst.name));
  }

  addLst(ev:any){
    if(ev.stopPropagation) ev.stopPropagation();
    this.lists.push(new TaskList(`Untitled-${this.lcnt++}`));
  }

  show(ev: any){
    console.log('lists', this.lists);
    console.log('tasks', this.tasks);
  }

  close(ev: MouseEvent){
    // if(ev.stopPropagation) ev.stopPropagation();
    if(this.drawer?.isOpened())
      this.drawer.close();
  }

  deleteLst(ev: any, lst: TaskList){
    this.dialog.show(DialogComponent.QUESTION, `Delete Task List '${lst.name}'?`, lst);
    this.dialog.onClose().subscribe(ret => {
      if(ret){
        console.log('done', ret);        
        this.rm(ev, lst);
      }
    });
  }

  tagInput(ev:any){
    console.log('tagInput', ev);
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
  }
}

/*
    if(ev.type == 'dblclick') { // instanceof MouseEvent){
      console.log('lstEdit', ev.target.id)
      ev.target.contenteditable='true';
    }else if(ev.type == 'blur'){
      console.log('lstEdit-blur', ev.target.id)
      ev.target.contenteditable='false';
    }
*/

/*
editName(ev:any, item: any){
    console.log('lstEdit', ev, ev.target.innerText);
    if(ev.preventDefault) ev.preventDefault();
    this.editable = false;
    item.name = ev.target.innerText;
    this.show(ev);
  }

  edit(ev:any, task:Task){

  }

  remove(ev:any, task:Task){

  }

  show(ev: any){
    console.log('lists', this.lists);
    console.log('tasks', this.tasks);
  }
  */
