
class SingletonQueue {
  pending?:Promise<any>

  push(func:()=>Promise<any>):void {
    if (this.pending) {
      this.pending.finally(func)
      return
    }
    this.pending = func()
  }

}

export default SingletonQueue
