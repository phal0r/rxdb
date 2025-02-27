import {
    Component,
    Output,
    EventEmitter,
    ChangeDetectionStrategy
} from '@angular/core';
import type {
    Observable,
} from 'rxjs';
import {
    tap
} from 'rxjs/operators';

import { DatabaseService } from '../../services/database.service';
import type {
    RxHeroDocument
} from '../../RxDB.d';

@Component({
    selector: 'heroes-list',
    templateUrl: './heroes-list.component.html',
    styleUrls: ['./heroes-list.component.less'],
    providers: [DatabaseService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesListComponent {

    public emittedFirst = false;
    public heroes$: Observable<RxHeroDocument[]>;
    @Output('edit') editChange: EventEmitter<RxHeroDocument> = new EventEmitter();

    constructor(
        private dbService: DatabaseService
    ) {
        this.heroes$ = this.dbService
            .db.hero                // collection
            .find({                 // query
                selector: {},
                sort: [{ name: 'asc' }]
            })
            .$.pipe(                // observable
                tap(() => this.emittedFirst = true)          // hide loading-icon on first emit
            );
    }

    set edit(hero: RxHeroDocument) {
        console.log('editHero: ' + hero.name);
        this.editChange.emit(hero);
    }
    editHero(hero: RxHeroDocument) {
        this.edit = hero;
    }
    deleteHero(hero: RxHeroDocument) {
        hero.remove();
    }

    /**
     * this method exists to play arround with the typings
     */
    async foo(): Promise<string> {
        const db = this.dbService.db;
        const firstDoc = await db.hero.findOne().exec();
        if (!firstDoc) return 'not found';
        const f: string = firstDoc.color;
        return f;
    }
}
